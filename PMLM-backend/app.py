
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from utils.db_utils import excel_to_sqlite, query_sqlite, execute_sql
from utils.tools.OCR import OCRTool
import os
import random
import jwt
import json


from datetime import datetime, timedelta, timezone
from functools import wraps

app = Flask(__name__)
CORS(app)

# ===== JWT 配置 =====
JWT_SECRET = os.environ.get('JWT_SECRET', 'dev_secret_only_for_local')
JWT_ALG = 'HS256'
JWT_EXPIRE_HOURS = 12

def make_token(payload: dict, hours=JWT_EXPIRE_HOURS):
    # 使用时区感知的 UTC 时间，避免弃用警告
    exp = datetime.now(timezone.utc) + timedelta(hours=hours)
    data = {**payload, 'exp': exp}
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALG)

def get_token_from_header():
    auth = request.headers.get('Authorization', '')
    if auth.lower().startswith('bearer '):
        return auth.split(' ', 1)[1].strip()
    return None

def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = get_token_from_header()
        if not token:
            return jsonify({'error': '未登录或缺少令牌'}), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
            g.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '登录已过期'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '无效令牌'}), 401
        return f(*args, **kwargs)
    return wrapper

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not getattr(g, 'user', None):
                return jsonify({'error': '未登录'}), 401
            if g.user.get('role') not in roles:
                return jsonify({'error': '无权限'}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

# 初始化数据库（如未创建）
def init_db():
    if not os.path.exists('medical.db'):
        excel_to_sqlite('disease.xlsx', 'patients')
        excel_to_sqlite('data.xlsx', 'records')
    # 创建 ocr_results 表（如未存在）
    create_ocr_table_sql = '''
        CREATE TABLE IF NOT EXISTS ocr_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_path TEXT,
            result TEXT,
            upload_time TEXT,
            user_id TEXT
        )
    '''
    execute_sql(create_ocr_table_sql)


# ===== API 接口 =====

@app.route('/api/db/init', methods=['POST'])
def db_init():
    excel_to_sqlite('disease.xlsx', 'patients')
    excel_to_sqlite('data.xlsx', 'records')
    return jsonify({'msg': '数据库初始化完成'})

# ===== 登录：病人/医生 =====
# 病人：提供 cardno（或住院号），存在即签发 token（载荷含 pid）
# 医生：示例固定账号 doctor/123456（生产请接入医生表或统一认证）
@app.route('/api/auth/login', methods=['POST'])
def login():
    body = request.get_json(silent=True) or {}
    role = str(body.get('role', '')).strip()

    if role == 'patient':
        cardno = str(body.get('cardno', '')).strip()
        if not cardno:
            return jsonify({'error': '缺少卡号/住院号'}), 400
        sql = "SELECT CARDNO, 住院号 FROM patients WHERE CARDNO = :id OR 住院号 = :id"
        data = query_sqlite(sql, { 'id': cardno })
        if not data:
            return jsonify({'error': '卡号/住院号不存在'}), 400
        pid = data[0].get('CARDNO') or str(data[0].get('住院号'))
        token = make_token({'role': 'patient', 'pid': pid})
        return jsonify({'token': token, 'role': 'patient'})

    if role == 'doctor':
        username = str(body.get('username', '')).strip()
        password = str(body.get('password', '')).strip()
        if username == 'doctor' and password == '123456':
            token = make_token({'role': 'doctor', 'uid': username})
            return jsonify({'token': token, 'role': 'doctor'})
        return jsonify({'error': '账号或密码错误'}), 400

    return jsonify({'error': 'role 必须为 patient 或 doctor'}), 400

# 病人仅查自己（令牌驱动，不信任前端参数）
@app.route('/api/patient/me', methods=['GET'])
@auth_required
@role_required('patient')
def patient_me():
    pid = g.user.get('pid', '')
    sql = "SELECT * FROM patients WHERE CARDNO = :pid OR 住院号 = :pid"
    data = query_sqlite(sql, { 'pid': pid })
    if data:
        return jsonify(data[0])
    return jsonify({'error': '未找到该病人'}), 404

# 测试接口
# 医生随机获取一个病人
@app.route('/api/patient/random', methods=['GET'])
@auth_required
@role_required('doctor')
def random_patient():
    sql = 'SELECT * FROM patients'
    data = query_sqlite(sql)
    if not data:
        return jsonify({'error': '无病人数据'})
    patient = random.choice(data)
    return jsonify(patient)

# 医生按条件查询病人（如姓名、住院号、卡号等）
@app.route('/api/patient/search', methods=['GET'])
@auth_required
@role_required('doctor')
def search_patient():
    keyword = request.args.get('keyword', '')
    sql = "SELECT * FROM patients WHERE 住院号 LIKE :kw OR CARDNO LIKE :kw"
    data = query_sqlite(sql, { 'kw': f"%{keyword}%" })
    return jsonify(data)

# 兼容保留：不建议外部使用的"自查"接口（容易越权）
@app.route('/api/patient/self', methods=['GET'])
def self_patient():
    return jsonify({'error': '该接口已弃用，请使用 /api/patient/me 并携带令牌'}), 410

# 图片OCR识别接口
@app.route('/api/ocr/recognize', methods=['POST'])
@auth_required
def recognize_image():
    try:
        # 检查是否有文件上传
        if 'image' not in request.files:
            return jsonify({'error': '未找到图片文件'}), 400
        
        file = request.files['image']
        
        # 检查文件名
        if file.filename == '':
            return jsonify({'error': '未选择图片文件'}), 400
        
        # 验证文件类型
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({'error': '不支持的文件类型，仅支持 png、jpg、jpeg、gif'}), 400
        
        # 创建临时目录用于存储上传的文件
        import os
        upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp_uploads')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        
        # 生成唯一的文件名以避免冲突
        import uuid
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # 保存文件到本地
        file.save(file_path)
        
        # 创建OCR工具实例并调用
        ocr_tool = OCRTool()
        # 构造参数字符串，传入文件路径
        # 使用json.dumps确保正确的JSON格式，避免路径中的特殊字符导致解析错误
        import json
        params = json.dumps({"image_path": file_path})
        result = ocr_tool.call(params)
        
        

        # g.user 是 dict（来自 jwt.decode），使用 .get()
        user_id_val = ''
        if getattr(g, 'user', None):
            user_id_val = g.user.get('pid') or g.user.get('uid') or ''
        # 强制转为字符串，避免 None 等问题
        user_id_val = str(user_id_val)

        # 保存识别结果到数据库
        sql_insert = """
            INSERT INTO ocr_results (image_path, result, upload_time, user_id)
            VALUES (:image_path, :result, :upload_time, :user_id)
        """
        params_insert = {
            'image_path': file_path,  # 图片保存的路径
            'result': result,         # OCR识别出来的文字内容
            'upload_time': datetime.now().isoformat(),  # 当前时间
            'user_id': user_id_val  # 用户标识
        }
        execute_sql(sql_insert, params_insert)
        # os.remove(file_path)
        
        return jsonify({'status': 'success', 'result': result}), 200
        
    except Exception as e:
        return jsonify({'error': f'处理图片时出错: {str(e)}'}), 500

# 查询病人所有检查记录（统一 SQL，按角色控制条件）
@app.route('/api/patient/records', methods=['GET'])
@auth_required
@role_required('doctor', 'patient')
def patient_records():
    role = g.user.get('role')
    params = { 'role': role }

    if role == 'patient':
        # 病人忽略前端参数，仅用令牌 pid（可能是 CARDNO 或 住院号）
        params['pid'] = g.user.get('pid', '')
        params['target'] = None
    else:
        # 医生必须提供 patient_id（住院号）
        patient_id = request.args.get('patient_id', '').strip()
        if not patient_id:
            return jsonify({'error': '缺少 patient_id'}), 400
        params['target'] = patient_id
        params['pid'] = ''

    sql = """
        SELECT r.*
        FROM records r
        WHERE (
            :role = 'doctor' AND r.住院号 = :target
        ) OR (
            :role = 'patient' AND (
                r.住院号 = :pid
                OR EXISTS (
                    SELECT 1 FROM patients p
                    WHERE p.住院号 = r.住院号 AND p.CARDNO = :pid
                )
            )
        )
    """
    data = query_sqlite(sql, params)
    return jsonify(data)

# ===== 病人自己修改patient（全字段可改，仅锁主键） =====
PROTECTED_KEYS = {'首页编号', '住院号', 'CARDNO', '序号'}   # 不允许碰

@app.route('/api/patient/update', methods=['POST'])
@auth_required
def patient_update():
    body = request.get_json(silent=True) or {}
    pid = g.user.get('pid')
    if not pid:
        return jsonify({'error': '令牌无效'}), 401

    # 1. 去掉主键，防止误改
    to_update = {k: v for k, v in body.items() if k not in PROTECTED_KEYS}
    if not to_update:
        return jsonify({'error': '未提供可修改字段'}), 400

    # 2. 构造 SET 子句
    set_clause = ', '.join([f"{k} = :{k}" for k in to_update])
    params = {**to_update, 'pid': pid}

    # 3. 执行更新
    sql = f"""
        UPDATE patients
        SET {set_clause}
        WHERE CARDNO = :pid OR 住院号 = :pid
    """
    row_count = execute_sql(sql, params)
    if row_count == 0:
        return jsonify({'error': '未找到该病人或无需更新'}), 404

    # 4. 返回更新后的完整记录
    new_row = query_sqlite("SELECT * FROM patients WHERE CARDNO = :pid OR 住院号 = :pid", {'pid': pid})
    return jsonify(new_row[0])

if __name__ == '__main__':
    init_db()
    app.run(host="0.0.0.0", port=3000)


from flask import Flask, jsonify, request, g
from flask_cors import CORS
from utils.db_utils import excel_to_sqlite, query_sqlite
import os
import random
import jwt
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

# 兼容保留：不建议外部使用的“自查”接口（容易越权）
@app.route('/api/patient/self', methods=['GET'])
def self_patient():
    return jsonify({'error': '该接口已弃用，请使用 /api/patient/me 并携带令牌'}), 410

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

if __name__ == '__main__':
    init_db()
    app.run(port=3000)

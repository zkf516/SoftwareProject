
from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.db_utils import excel_to_sqlite, query_sqlite
import os
import random

app = Flask(__name__)
CORS(app)

# 初始化数据库（如未创建）
def init_db():
    if not os.path.exists('medical.db'):
        excel_to_sqlite('disease.xlsx', 'patients')
        excel_to_sqlite('data.xlsx', 'records')

@app.route('/api/db/init', methods=['POST'])
def db_init():
    excel_to_sqlite('disease.xlsx', 'patients')
    excel_to_sqlite('data.xlsx', 'records')
    return jsonify({'msg': '数据库初始化完成'})

# 医生随机获取一个病人
@app.route('/api/patient/random', methods=['GET'])
def random_patient():
    sql = 'SELECT * FROM patients'
    data = query_sqlite(sql)
    if not data:
        return jsonify({'error': '无病人数据'})
    patient = random.choice(data)
    return jsonify(patient)

# 医生按条件查询病人（如姓名、住院号、卡号等）
@app.route('/api/patient/search', methods=['GET'])
def search_patient():
    keyword = request.args.get('keyword', '')
    sql = f"SELECT * FROM patients WHERE 姓名 LIKE '%{keyword}%' OR 住院号 LIKE '%{keyword}%' OR CARDNO LIKE '%{keyword}%'"
    data = query_sqlite(sql)
    return jsonify(data)

# 病人查自己（通过卡号）
@app.route('/api/patient/self', methods=['GET'])
def self_patient():
    cardno = request.args.get('cardno', '')
    sql = f"SELECT * FROM patients WHERE CARDNO = '{cardno}'"
    data = query_sqlite(sql)
    if data:
        return jsonify(data[0])
    return jsonify({'error': '未找到该病人'})

# 查询病人所有检查记录（通过住院号）
@app.route('/api/patient/records', methods=['GET'])
def patient_records():
    patient_id = request.args.get('patient_id', '')
    sql = f"SELECT * FROM records WHERE 住院号 = '{patient_id}'"
    data = query_sqlite(sql)
    return jsonify(data)

if __name__ == '__main__':
    init_db()
    app.run(port=3000)

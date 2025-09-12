from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.excel_reader import read_excel


app = Flask(__name__)
CORS(app)

@app.route('/api/excel', methods=['GET'])
def get_excel():
    file = request.args.get('file', 'disease.xlsx')
    sheet = int(request.args.get('sheet', 0))
    data = read_excel(file, sheet)
    return jsonify(data)

@app.route('/api/excel/row', methods=['GET'])
def get_row():
    file = request.args.get('file', 'disease.xlsx')
    sheet = int(request.args.get('sheet', 0))
    index = int(request.args.get('index', 0))
    data = read_excel(file, sheet)
    if isinstance(data, list) and 0 <= index < len(data):
        return jsonify(data[index])
    return jsonify({'error': '索引超出范围'})

if __name__ == '__main__':
    app.run(port=3000)

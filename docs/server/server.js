
const express = require('express');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const PORT = 3000;

// 允许跨域访问
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// 通用读取 Excel 接口
app.get('/api/excel', (req, res) => {
    const file = req.query.file || 'disease.xlsx';
    const sheetIndex = parseInt(req.query.sheet) || 0;
    try {
        const filePath = path.join(__dirname, file);
        const workbook = XLSX.readFile(filePath);
        if (workbook.SheetNames.length <= sheetIndex) {
            return res.status(400).json({ error: 'Excel 文件中没有对应的工作表' });
        }
        const sheetName = workbook.SheetNames[sheetIndex];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: '读取 Excel 文件失败' });
    }
});

// 获取指定行数据
app.get('/api/excel/row', (req, res) => {
    const file = req.query.file || 'disease.xlsx';
    const sheetIndex = parseInt(req.query.sheet) || 0;
    const index = parseInt(req.query.index) || 0;
    try {
        const filePath = path.join(__dirname, file);
        const workbook = XLSX.readFile(filePath);
        if (workbook.SheetNames.length <= sheetIndex) {
            return res.status(400).json({ error: 'Excel 文件中没有对应的工作表' });
        }
        const sheetName = workbook.SheetNames[sheetIndex];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (!Number.isInteger(index) || index < 0 || index >= data.length) {
            return res.status(400).json({ error: '无效的索引' });
        }
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ error: '读取 Excel 文件失败' });
    }
});

app.listen(PORT, () => {
    console.log(`服务器正在运行：http://localhost:${PORT}`);
    console.log(`接口示例：/api/excel?file=disease.xlsx&sheet=0`);
    console.log(`接口示例：/api/excel/row?file=disease.xlsx&sheet=0&index=0`);
});

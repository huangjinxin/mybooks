const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// 初始化一个新的数据库实例，如果文件不存在则会被创建
const db = new sqlite3.Database('./mydatabase.db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// API获取交易记录
app.get('/api/transactions', (req, res) => {
  db.all("SELECT * FROM transactions", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API添加新的交易记录
app.post('/api/transaction', (req, res) => {
  const { amount, type, description } = req.body;
  const date = new Date().toISOString();

  const sql = `INSERT INTO transactions (date, amount, type, description) VALUES (?, ?, ?, ?)`;
  const params = [date, amount, type, description];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "New transaction added",
      id: this.lastID
    });
  });
});

// ...更多路由...

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

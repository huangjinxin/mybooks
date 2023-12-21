const sqlite3 = require('sqlite3').verbose();

// 初始化一个新的数据库实例，如果文件不存在则会被创建
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      amount REAL,
      type TEXT,
      description TEXT
    )`, 
    (err) => {
      if (err) {
        // 表已存在
      } else {
        // 表刚创建，可以在这里插入数据
      }
    });  
  }
});

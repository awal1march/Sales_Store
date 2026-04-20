const Database = require("better-sqlite3");

// ✅ CREATE DATABASE INSTANCE FIRST
const db = new Database("payments.db");

// ✅ THEN USE IT
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  item TEXT,
  total_amount REAL,
  paid_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("Database ready ✅");

// ✅ EXPORT
module.exports = db;
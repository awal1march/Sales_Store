const Database = require("better-sqlite3");
const path = require("path");

// ALWAYS safe path
const dbPath = path.join(__dirname, "payments.db");

const db = new Database(dbPath);

// create table
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    item TEXT,
    total_amount REAL,
    paid_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Database ready ✅");

module.exports = db;
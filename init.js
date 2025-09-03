const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./erp.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        sku TEXT,
        qty INTEGER,
        batch TEXT,
        expiry TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        product_id INTEGER,
        qty INTEGER,
        date TEXT
    )`);
});

module.exports = db;
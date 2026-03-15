// ============================================================
// Database Connection Configuration
// ============================================================
// Uses mysql2 with promise wrapper for async/await support.
// Connection pooling is used for better performance -
// the pool maintains multiple connections and reuses them.
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'EmergencyDB',
  waitForConnections: true,
  connectionLimit: 10,       // Max simultaneous connections
  queueLimit: 0              // Unlimited waiting requests
});

module.exports = pool;

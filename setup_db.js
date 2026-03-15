// Quick script to set up the database using Node.js
const mysql = require('./backend/node_modules/mysql2/promise');
const fs = require('fs');

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', multipleStatements: true });

  console.log('Connected to MySQL/MariaDB');

  // Run schema
  const schema = fs.readFileSync('./database/schema.sql', 'utf8');
  await conn.query(schema);
  console.log('Schema created successfully');

  // Run sample data
  const data = fs.readFileSync('./database/sample_data.sql', 'utf8');
  await conn.query(data);
  console.log('Sample data inserted successfully');

  await conn.end();
  console.log('Done! EmergencyDB is ready.');
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });

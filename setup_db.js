// Quick script to set up the database using Node.js
const mysql = require('./backend/node_modules/mysql2/promise');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && key.trim()) process.env[key.trim()] = val.join('=').trim();
  });
}

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  console.log('Connected to MySQL');

  const schema = fs.readFileSync('./database/schema.sql', 'utf8');
  await conn.query(schema);
  console.log('Schema created successfully');

  const data = fs.readFileSync('./database/sample_data.sql', 'utf8');
  await conn.query(data);
  console.log('Sample data inserted successfully');

  await conn.end();
  console.log('Done! EmergencyDB is ready.');
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });

// backend/config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Create a new PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // required for Render's managed Postgres
  },
});

// Test connection
pool.connect()
  .then((client) => {
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.stack);
  });

module.exports = pool;

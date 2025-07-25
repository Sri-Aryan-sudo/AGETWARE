require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    console.log('Connected to DB. Time:', res.rows[0]);
  }
});



// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

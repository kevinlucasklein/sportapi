const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sports_db',
  password: 'kevin',
  port: 5432,
});

module.exports = pool;

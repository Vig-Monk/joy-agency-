import pool from '../db.js'

const schema = `
  CREATE TABLE IF NOT EXISTS workers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    bio TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS booking_requests (
    id SERIAL PRIMARY KEY,
    worker_id INTEGER REFERENCES workers(id) ON DELETE SET NULL,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS worker_views (
    id SERIAL PRIMARY KEY,
    worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
  );
`

async function runSchema() {
  try {
    await pool.query(schema)
    console.log('✅ Schema created successfully')
    process.exit(0)
  } catch (err) {
    console.error('❌ Schema error:', err.message)
    process.exit(1)
  }
}

runSchema()

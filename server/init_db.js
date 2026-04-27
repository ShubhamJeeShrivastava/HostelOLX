require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDb = async () => {
  try {
    console.log('Connecting to PostgreSQL database to recreate schema...');
    
    // Drop existing tables
    await pool.query(`DROP TABLE IF EXISTS messages CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS items CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS hostels CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS colleges CASCADE;`);
    
    // Create Colleges
    await pool.query(`
      CREATE TABLE colleges (
        id SERIAL PRIMARY KEY,
        domain VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL
      );
    `);

    // Create Hostels
    await pool.query(`
      CREATE TABLE hostels (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL
      );
    `);

    // Create Users
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        year_of_study VARCHAR(20),
        college_id INTEGER REFERENCES colleges(id) ON DELETE SET NULL,
        hostel_id INTEGER REFERENCES hostels(id) ON DELETE SET NULL,
        profile_photo TEXT,
        trust_score NUMERIC DEFAULT 0,
        deals_count INTEGER DEFAULT 0,
        verified_at TIMESTAMP,
        response_time_mins INTEGER DEFAULT 120,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Items
    await pool.query(`
      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        condition VARCHAR(50) NOT NULL,
        image TEXT NOT NULL,
        category VARCHAR(100),
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'Available',
        is_negotiable BOOLEAN DEFAULT false,
        pickup_zone VARCHAR(255),
        expires_at TIMESTAMP,
        meta JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Messages
    await pool.query(`
      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Schema created successfully.');

    // Seed Data
    console.log('Seeding mock data...');

    const insertCollegeQuery = `INSERT INTO colleges (domain, name, city) VALUES ($1, $2, $3) RETURNING id;`;
    const collegeIitbRes = await pool.query(insertCollegeQuery, ['iitb.ac.in', 'IIT Bombay', 'Mumbai']);
    const collegeIitbId = collegeIitbRes.rows[0].id;
    
    const hostelARes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel A') RETURNING id;`, [collegeIitbId]);
    const hostelBRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel B') RETURNING id;`, [collegeIitbId]);
    const haId = hostelARes.rows[0].id;
    const hbId = hostelBRes.rows[0].id;

    // Users
    const u1Res = await pool.query(`INSERT INTO users (name, email, year_of_study, college_id, hostel_id, trust_score, deals_count, verified_at, response_time_mins) VALUES ('Alice', 'alice@iitb.ac.in', '4th', $1, $2, 4.9, 12, NOW(), 30) RETURNING id;`, [collegeIitbId, haId]);
    const u2Res = await pool.query(`INSERT INTO users (name, email, year_of_study, college_id, hostel_id, trust_score, deals_count, verified_at, response_time_mins) VALUES ('Rahul K.', 'rahul@iitb.ac.in', '3rd', $1, $2, 4.8, 7, NOW(), 120) RETURNING id;`, [collegeIitbId, hbId]);
    const u1 = u1Res.rows[0].id;
    const u2 = u2Res.rows[0].id;

    // Items
    const insertItemQuery = `
      INSERT INTO items (seller_id, title, price, condition, image, category, type, is_negotiable, pickup_zone, expires_at, meta, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() + INTERVAL '30 days', $10, NOW() - $11::INTERVAL)
    `;

    const items = [
      [u1, 'Engineering Physics Textbook', 250, 'Good', 'https://picsum.photos/seed/book1/400/400', 'Books & Notes', 'Sell', false, 'Hostel A Lobby', JSON.stringify({ brand: null, model: null, age: '1 year' }), '2 hours'],
      [u2, 'Scientific Calculator (FX-991EX)', 800, 'Like New', 'https://picsum.photos/seed/calc/400/400', 'Electronics', 'Sell', true, 'Hostel B Common Area', JSON.stringify({ brand: 'Casio', model: 'FX-991EX Classwiz', age: '~14 months', includes: 'Original box, case, manual', mrp: '₹1,395', description: 'Selling my Casio FX-991EX — used only for 2 sems. Works perfectly, all functions intact including QR code feature. Comes with original box and protective case. Upgrading to a graphing calculator, so this needs a new home. Ideal for Maths, Physics or any engg branch. Can demonstrate before purchase.' }), '10 days']
    ];

    for (const item of items) {
      await pool.query(insertItemQuery, item);
    }

    console.log('Database fully seeded with connected associations.');

  } catch (error) {
    console.error('Failed to execute database rework:', error);
  } finally {
    await pool.end();
  }
};

initDb();

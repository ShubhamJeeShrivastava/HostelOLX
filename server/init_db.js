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

    // 1. College
    const collegeRes = await pool.query(`
      INSERT INTO colleges (domain, name, city) 
      VALUES ('iitb.ac.in', 'IIT Bombay', 'Mumbai') RETURNING id;
    `);
    const collegeId = collegeRes.rows[0].id;

    // 2. Hostels
    const hostelARes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel A') RETURNING id;`, [collegeId]);
    const hostelBRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel B') RETURNING id;`, [collegeId]);
    const hostelCRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel C') RETURNING id;`, [collegeId]);
    const hostelDRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel D') RETURNING id;`, [collegeId]);

    const haId = hostelARes.rows[0].id;
    const hbId = hostelBRes.rows[0].id;
    const hcId = hostelCRes.rows[0].id;
    const hdId = hostelDRes.rows[0].id;

    // 3. Users
    const user1Res = await pool.query(`INSERT INTO users (name, email, year_of_study, college_id, hostel_id) VALUES ('Alice', 'alice@iitb.ac.in', '4th', $1, $2) RETURNING id;`, [collegeId, haId]);
    const user2Res = await pool.query(`INSERT INTO users (name, email, year_of_study, college_id, hostel_id) VALUES ('Bob', 'bob@iitb.ac.in', '2nd', $1, $2) RETURNING id;`, [collegeId, hbId]);
    const user3Res = await pool.query(`INSERT INTO users (name, email, year_of_study, college_id, hostel_id) VALUES ('Charlie', 'charlie@iitb.ac.in', '1st', $1, $2) RETURNING id;`, [collegeId, hcId]);
    const user4Res = await pool.query(`INSERT INTO users (name, email, year_of_study, college_id, hostel_id) VALUES ('Diana', 'diana@iitb.ac.in', '3rd', $1, $2) RETURNING id;`, [collegeId, hdId]);

    const u1 = user1Res.rows[0].id; // Hostel A
    const u2 = user2Res.rows[0].id; // Hostel B
    const u3 = user3Res.rows[0].id; // Hostel C
    const u4 = user4Res.rows[0].id; // Hostel D

    // 4. Items (Matching previous frontend data exactly, with shifted created_at dates to simulate "postedAt")
    const insertItemQuery = `
      INSERT INTO items (seller_id, title, price, condition, image, category, type, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - $8::INTERVAL)
    `;

    // format: [seller_id, title, price, condition, image, category, type, interval_str]
    const items = [
      [u1, 'Engineering Physics Textbook', 250, 'Good', 'https://picsum.photos/seed/book1/400/400', 'Books & Notes', 'Sell', '2 hours'],
      [u2, 'Electric Kettle - 1.5L', 600, 'Like New', 'https://picsum.photos/seed/kettle/400/400', 'Furniture & Appliances', 'Sell', '5 hours'],
      [u1, 'Study Table Lamp', 150, 'Fair', 'https://picsum.photos/seed/lamp/400/400', 'Room Essentials', 'Sell', '1 day'],
      [u3, 'Bicycle for Semester', 500, 'Good', 'https://picsum.photos/seed/bike/400/400', 'Cycles & Transport', 'Rent', '3 hours'],
      [u2, 'Scientific Calculator (FX-991EX)', 800, 'Like New', 'https://picsum.photos/seed/calc/400/400', 'Stationery', 'Sell', '10 minutes'],
      [u1, 'Lab Coat - Size L', 200, 'Good', 'https://picsum.photos/seed/coat/400/400', 'Clothing & Gear', 'Sell', '6 hours'],
      [u4, 'Dumbbells Set (5kg x 2)', 400, 'Good', 'https://picsum.photos/seed/gym/400/400', 'Other', 'Sell', '12 hours'],
      [u2, 'Data Structures Notes (Handwritten)', 0, 'Good', 'https://picsum.photos/seed/notes/400/400', 'Books & Notes', 'Lend', '1 hour']
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

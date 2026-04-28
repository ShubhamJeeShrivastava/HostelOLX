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
    await pool.query(`DROP TABLE IF EXISTS college_domains CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS colleges CASCADE;`);
    
    // Create College Domains
    await pool.query(`
      CREATE TABLE college_domains (
        id SERIAL PRIMARY KEY,
        college_name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50) NOT NULL,
        regex_pattern VARCHAR(255) NOT NULL
      );
    `);

    // Insert Mappings
    await pool.query(`
      INSERT INTO college_domains (college_name, short_name, regex_pattern) VALUES
      ('Indian Institute of Technology Bombay', 'IITB', '^[a-zA-Z0-9.*%+-]+@iitb\\.ac\\.in$'),
      ('Indian Institute of Technology Delhi', 'IITD', '^[a-zA-Z0-9.*%+-]+@iitd\\.ac\\.in$'),
      ('Indian Institute of Technology Madras', 'IITM', '^[a-zA-Z0-9.*%+-]+@iitm\\.ac\\.in$'),
      ('Indian Institute of Technology Kharagpur', 'IITKGP', '^[a-zA-Z0-9.*%+-]+@iitkgp\\.ac\\.in$'),
      ('Indian Institute of Technology Kanpur', 'IITK', '^[a-zA-Z0-9._%+-]+@iitk\\.ac\\.in$'),
      ('National Institute of Technology Tiruchirappalli', 'NITT', '^[a-zA-Z0-9.*%+-]+@nitt\\.edu$'),
      ('National Institute of Technology Warangal', 'NITW', '^[a-zA-Z0-9.*%+-]+@nitw\\.ac\\.in$'),
      ('National Institute of Technology Surathkal', 'NITK', '^[a-zA-Z0-9.*%+-]+@nitk\\.edu\\.in$'),
      ('National Institute of Technology Rourkela', 'NITRKL', '^[a-zA-Z0-9.*%+-]+@nitrkl\\.ac\\.in$'),
      ('National Institute of Technology Calicut', 'NITC', '^[a-zA-Z0-9._%+-]+@nitc\\.ac\\.in$'),
      ('IIIT Hyderabad', 'IIITH', '^[a-zA-Z0-9.*%+-]+@iiit\\.ac\\.in$'),
      ('IIIT Delhi', 'IIITD', '^[a-zA-Z0-9.*%+-]+@iiitd\\.ac\\.in$'),
      ('IIIT Bangalore', 'IIITB', '^[a-zA-Z0-9.*%+-]+@iiitb\\.ac\\.in$'),
      ('IIIT Allahabad', 'IIITA', '^[a-zA-Z0-9.*%+-]+@iiita\\.ac\\.in$'),
      ('IIIT Gwalior', 'IIITM', '^[a-zA-Z0-9.*%+-]+@iiitm\\.ac\\.in$'),
      ('IIIT Nagpur', 'IIITN', '^[a-zA-Z0-9.*%+-]+@iiitn\\.ac\\.in$');
    `);

    // Create Hostels
    await pool.query(`
      CREATE TABLE hostels (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES college_domains(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL
      );
    `);

    // Create Users
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255),
        year_of_study VARCHAR(20),
        college_id INTEGER REFERENCES college_domains(id) ON DELETE SET NULL,
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
        college_id INTEGER REFERENCES college_domains(id) ON DELETE CASCADE,
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

    const colRes = await pool.query(`SELECT id FROM college_domains WHERE short_name = 'IITB'`);
    const collegeIitbId = colRes.rows[0].id;
    
    // Add NITT just to have diverse items
    const colRes2 = await pool.query(`SELECT id FROM college_domains WHERE short_name = 'NITT'`);
    const collegeNittId = colRes2.rows[0].id;

    const hostelARes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel A') RETURNING id;`, [collegeIitbId]);
    const hostelBRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel B') RETURNING id;`, [collegeIitbId]);
    const hostelCRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Hostel C') RETURNING id;`, [collegeIitbId]);

    const hostelNittRes = await pool.query(`INSERT INTO hostels (college_id, name) VALUES ($1, 'Garnet') RETURNING id;`, [collegeNittId]);
    
    const haId = hostelARes.rows[0].id;
    const hbId = hostelBRes.rows[0].id;
    const hcId = hostelCRes.rows[0].id;
    const nittHostelId = hostelNittRes.rows[0].id;

    // Use bcrypt for mocked password if needed, but here we can just store an unhashed one for dummy users or mock hash.
    // For MVP dummy testing let's just insert standard bcrypt for 'password' -> $2a$10$tZPKZ1kZ5F/9Q38R6YqUeeWJ6d9i9O1xIuJkC0Hl1o1kE9H/K6L.i
    const passHash = '$2b$10$w85Vw6tL6bK2L9.1M0QvLu0/gJ6XQk1N6y5Q4hKxZ9qK0bNq5YvM6'; // "password123"

    // Users
    const u1Res = await pool.query(`INSERT INTO users (name, email, password, year_of_study, college_id, hostel_id, trust_score, deals_count, verified_at, response_time_mins) VALUES ('Alice', 'alice@iitb.ac.in', $3, '4th', $1, $2, 4.9, 12, NOW(), 30) RETURNING id;`, [collegeIitbId, haId, passHash]);
    const u2Res = await pool.query(`INSERT INTO users (name, email, password, year_of_study, college_id, hostel_id, trust_score, deals_count, verified_at, response_time_mins) VALUES ('Rahul K.', 'rahul@iitb.ac.in', $3, '3rd', $1, $2, 4.8, 7, NOW(), 120) RETURNING id;`, [collegeIitbId, hbId, passHash]);
    const u3Res = await pool.query(`INSERT INTO users (name, email, password, year_of_study, college_id, hostel_id, trust_score, deals_count, verified_at, response_time_mins) VALUES ('Siddharth', 'sid@iitb.ac.in', $3, '2nd', $1, $2, 4.5, 4, NOW(), 45) RETURNING id;`, [collegeIitbId, hcId, passHash]);
    const u4Res = await pool.query(`INSERT INTO users (name, email, password, year_of_study, college_id, hostel_id, trust_score, deals_count, verified_at, response_time_mins) VALUES ('Vivek', 'vivek@nitt.edu', $3, '1st', $1, $2, 5.0, 1, NOW(), 15) RETURNING id;`, [collegeNittId, nittHostelId, passHash]);
    
    const u1 = u1Res.rows[0].id;
    const u2 = u2Res.rows[0].id;
    const u3 = u3Res.rows[0].id;
    const u4 = u4Res.rows[0].id;

    // Items
    const insertItemQuery = `
      INSERT INTO items (seller_id, college_id, title, price, condition, image, category, type, is_negotiable, pickup_zone, expires_at, meta, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW() + INTERVAL '30 days', $11, NOW() - $12::INTERVAL)
    `;

    const items = [
      [u1, collegeIitbId, 'Engineering Physics Textbook', 250, 'Good', '/images/textbook_1777324606549.png', 'Books & Notes', 'Sell', false, 'Hostel A Lobby', JSON.stringify({ age: '2 years', description: 'Used but in great condition. No torn pages.' }), '2 hours'],
      [u2, collegeIitbId, 'Scientific Calculator (FX-991EX)', 800, 'Like New', '/images/calculator_1777324622693.png', 'Electronics', 'Sell', true, 'Hostel B Common Area', JSON.stringify({ brand: 'Casio', model: 'FX-991EX Classwiz', age: '~14 months', includes: 'Original box, case, manual', mrp: '₹1,395', description: 'Selling my Casio FX-991EX — used only for 2 sems. Works perfectly. Can demonstrate before purchase.' }), '10 days'],
      [u3, collegeIitbId, 'Electric Kettle - 1.5L', 500, 'Like New', '/images/kettle_1777324636147.png', 'Furniture & Appliances', 'Sell', true, 'Hostel C Room 101', JSON.stringify({ brand: 'Bosch', condition: 'Very clean, used rarely', description: 'Perfect for quick maggi or tea in your room. Boils super fast.' }), '5 hours'],
      [u1, collegeIitbId, 'Study Table Lamp', 250, 'Good', '/images/lamp_1777324650978.png', 'Room Essentials', 'Sell', false, 'Hostel A Library', JSON.stringify({ brand: 'Generic', description: 'Bright yellow desk lamp perfect for late night study sessions.' }), '1 day'],
      [u2, collegeIitbId, 'Bicycle for Campus Move', 200, 'Fair', '/images/bicycle_1777324665736.png', 'Cycles & Transport', 'Rent', false, 'North Hall Gate', JSON.stringify({ description: 'Renting out my cycle for the semester. Sturdy Trek bike.' }), '3 hours'],
      [u3, collegeIitbId, 'Lab Coat - Size M/L', 150, 'Like New', '/images/lab_coat_1777324686973.png', 'Clothing & Gear', 'Sell', false, 'Hostel C Corridor', JSON.stringify({ description: 'Only worn twice for chemistry lab. Perfectly washed.' }), '6 hours'],
      [u4, collegeNittId, 'Dumbbells Set (5kg x 2)', 600, 'Good', '/images/dumbbells_1777324786705.png', 'Clothing & Gear', 'Sell', true, 'Garnet Gym', JSON.stringify({ weight: '5kg each', description: 'Hardly used dumbbells for room workouts.' }), '12 hours'],
      [u2, collegeIitbId, 'Drafting Board (A3)', 300, 'Good', '/images/drafting_board_1777325007785.png', 'Stationery', 'Sell', true, 'Hostel B Common Area', JSON.stringify({ size: 'A3', description: 'Wooden drafting board ideal for engineering graphics courses.' }), '2 days']
    ];

    for (const item of items) {
      await pool.query(insertItemQuery, item);
    }

    console.log('Database fully seeded with real images.');

  } catch (error) {
    console.error('Failed to execute database rework:', error);
  } finally {
    await pool.end();
  }
};

initDb();

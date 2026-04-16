require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDb = async () => {
  try {
    console.log('Connecting to PostgreSQL database...');
    
    // Drop existing table to update schema
    await pool.query(`DROP TABLE IF EXISTS items;`);
    
    // Create items table matching frontend mock data
    await pool.query(`
      CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        condition VARCHAR(50) NOT NULL,
        image TEXT NOT NULL,
        "sellerHostel" VARCHAR(100) NOT NULL,
        "postedAt" VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL
      );
    `);
    console.log('Table "items" created successfully.');

    // Insert mock data matching the frontend's mockup
    const insertQuery = `
      INSERT INTO items (title, price, condition, image, "sellerHostel", "postedAt", type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const mockItems = [
      ['Engineering Physics Textbook', 250, 'Good', 'https://picsum.photos/seed/book1/400/400', 'Hostel A', '2 hours ago', 'Sell'],
      ['Electric Kettle - 1.5L', 600, 'Like New', 'https://picsum.photos/seed/kettle/400/400', 'Hostel B', '5 hours ago', 'Sell'],
      ['Study Table Lamp', 150, 'Fair', 'https://picsum.photos/seed/lamp/400/400', 'Hostel A', '1 day ago', 'Sell'],
      ['Bicycle for Semester', 500, 'Good', 'https://picsum.photos/seed/bike/400/400', 'Hostel C', '3 hours ago', 'Rent'],
      ['Scientific Calculator (FX-991EX)', 800, 'Like New', 'https://picsum.photos/seed/calc/400/400', 'Hostel B', '10 mins ago', 'Sell'],
      ['Lab Coat - Size L', 200, 'Good', 'https://picsum.photos/seed/coat/400/400', 'Hostel A', '6 hours ago', 'Sell'],
      ['Dumbbells Set (5kg x 2)', 400, 'Good', 'https://picsum.photos/seed/gym/400/400', 'Hostel D', '12 hours ago', 'Sell'],
      ['Data Structures Notes (Handwritten)', 0, 'Good', 'https://picsum.photos/seed/notes/400/400', 'Hostel B', '1 hour ago', 'Lend']
    ];

    for (const item of mockItems) {
      await pool.query(insertQuery, item);
    }
    console.log('Mock items seeded successfully.');

  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
};

initDb();

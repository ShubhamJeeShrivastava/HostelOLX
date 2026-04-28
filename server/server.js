require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // invalid token
  }
  next();
};

app.use(authMiddleware);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HostelOLX Backend is running!', dburl: process.env.DATABASE_URL });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const { rows: domains } = await db.query('SELECT * FROM college_domains');
    
    let matchedCollegeId = null;
    for (const domain of domains) {
      const regex = new RegExp(domain.regex_pattern);
      if (regex.test(email)) {
        matchedCollegeId = domain.id;
        break;
      }
    }

    if (!matchedCollegeId) {
      return res.status(400).json({ error: 'Invalid college email.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (name, email, password, college_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, college_id`,
      [fullName, email, hashed, matchedCollegeId]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, college_id: user.college_id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
       return res.status(400).json({ error: 'Email already exists.' });
    }
    console.error('Registration error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, college_id: user.college_id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, college_id: user.college_id }, token });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/colleges', async (req, res) => {
  try {
    const query = `SELECT id, college_name as name, short_name, regex_pattern FROM college_domains ORDER BY name ASC;`;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching colleges', err, 'DB_URL:', process.env.DATABASE_URL);
    res.status(500).json({ error: 'Internal server error fetching colleges' });
  }
});

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

app.get('/api/items', async (req, res) => {
  try {
    const { search, college_id } = req.query;
    const activeCollegeId = req.user ? req.user.college_id : college_id;

    if (!activeCollegeId) {
      return res.json([]);
    }

    let query = `
      SELECT 
        i.id, i.title, i.price, i.condition, i.image, i.category, i.type, i.created_at,
        h.name as hostel_name
      FROM items i
      JOIN users u ON i.seller_id = u.id
      LEFT JOIN hostels h ON u.hostel_id = h.id
      WHERE i.college_id = $1
    `;
    
    const params = [activeCollegeId];
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (i.title ILIKE $2 OR i.category ILIKE $2 OR i.type ILIKE $2 OR i.condition ILIKE $2)`;
    }
    
    query += ` ORDER BY i.created_at DESC;`;

    const { rows } = await db.query(query, params);
    
    const formattedRows = rows.map(r => ({
      id: String(r.id),
      title: r.title,
      price: r.price,
      condition: r.condition,
      image: r.image,
      category: r.category,
      type: r.type,
      sellerHostel: r.hostel_name,
      postedAt: timeAgo(new Date(r.created_at))
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching items database', err);
    res.status(500).json({ error: 'Internal server error fetching items' });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        i.*,
        u.name as seller_name, u.year_of_study, u.trust_score, u.deals_count, u.verified_at, u.response_time_mins,
        h.name as seller_hostel,
        c.college_name as seller_college
      FROM items i
      JOIN users u ON i.seller_id = u.id
      LEFT JOIN hostels h ON u.hostel_id = h.id
      JOIN college_domains c ON u.college_id = c.id
      WHERE i.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching item details', err);
    res.status(500).json({ error: 'Internal server error fetching item details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

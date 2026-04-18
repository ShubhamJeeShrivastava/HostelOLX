require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HostelOLX Backend is running!' });
});

app.get('/api/colleges', async (req, res) => {
  try {
    const query = `SELECT id, domain, name, city FROM colleges ORDER BY name ASC;`;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching colleges', err);
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
    const { search } = req.query;
    
    let query = `
      SELECT 
        i.id, i.title, i.price, i.condition, i.image, i.category, i.type, i.created_at,
        h.name as hostel_name
      FROM items i
      JOIN users u ON i.seller_id = u.id
      JOIN hostels h ON u.hostel_id = h.id
    `;
    
    const params = [];
    if (search) {
      query += ` WHERE i.title ILIKE $1 OR i.category ILIKE $1`;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY i.created_at DESC;`;

    const { rows } = await db.query(query, params);
    
    // Format the response to perfectly match the frontend requirement
    const formattedRows = rows.map(r => ({
      id: String(r.id), // Ensure id is string if expected by frontend
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

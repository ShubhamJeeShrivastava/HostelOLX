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

app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM items');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching items database', err);
    res.status(500).json({ error: 'Internal server error fetching items' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

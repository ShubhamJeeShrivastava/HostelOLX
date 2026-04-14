const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HostelOLX Backend is running!' });
});

// Mock items for the landing page
app.get('/api/items', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Single Bed Mattress',
      condition: 'Used - Good',
      price: 800,
      originalPrice: 2500,
      discount: '70% OFF',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      seller: 'Rahul (3rd Year)',
      tag: 'Har Din Sasta!'
    },
    {
      id: 2,
      title: 'Hero Cycle',
      condition: 'Like New',
      price: 1500,
      originalPrice: 3500,
      discount: '40% OFF',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      seller: 'Priya (4th Year)',
      tag: 'Add'
    },
    {
      id: 3,
      title: 'Engineering Physics',
      condition: 'New',
      price: 250,
      originalPrice: 500,
      discount: '50% OFF',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      seller: 'Amit (2nd Year)',
      tag: 'Har Din Sasta!'
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

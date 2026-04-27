const fs = require('fs');
let content = fs.readFileSync('server/server.js', 'utf8');

const newRoute = `
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = \`
      SELECT 
        i.*,
        u.name as seller_name, u.year_of_study, u.trust_score, u.deals_count, u.verified_at, u.response_time_mins,
        h.name as seller_hostel,
        c.name as seller_college
      FROM items i
      JOIN users u ON i.seller_id = u.id
      JOIN hostels h ON u.hostel_id = h.id
      JOIN colleges c ON u.college_id = c.id
      WHERE i.id = $1
    \`;
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
`;

if (!content.includes('/api/items/:id')) {
  content = content.replace('app.listen(PORT, () => {', newRoute);
  fs.writeFileSync('server/server.js', content);
  console.log('patched');
} else {
  console.log('already patched');
}

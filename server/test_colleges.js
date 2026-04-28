require('dotenv').config();
const db = require('./db');
async function run() {
  try {
    const { rows } = await db.query('SELECT * FROM college_domains;');
    console.log("Success, rows:", rows.length);
  } catch (err) {
    console.error("Failed:", err);
  }
}
run();

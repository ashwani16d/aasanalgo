const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../utils/db');

// POST /api/register
router.post('/register', async (req, res) => {
  const { fullName, email, password, mobile } = req.body;

  if (!email || !password || !fullName || !mobile) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO users (full_name, email, mobile_number, password_hash, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, mobile, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

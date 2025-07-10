const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, full_name, mobile_number } = req.body;

  try {
    const [existing] = await db.execute('SELECT id FROM profiles WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(`
      INSERT INTO profiles (id, email, full_name, mobile_number, admin_password, role)
      VALUES (?, ?, ?, ?, ?, 'user')
    `, [id, email, full_name, mobile_number, hashedPassword]);

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM profiles WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.admin_password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;

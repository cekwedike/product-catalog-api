const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    // In a real app, you would verify credentials here
    const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
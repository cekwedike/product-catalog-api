const express = require('express');
const router = express.Router();
const { generateToken, comparePassword } = require('../config/auth');

// In a real application, you would have a User model and database
const mockUsers = {
  admin: {
    id: '1',
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // bcrypt hash of "password"
  }
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user (in a real app, this would be a database query)
    const user = mockUsers[username];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
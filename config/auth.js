const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: '24h',
  passwordSaltRounds: 10
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiration
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, authConfig.jwtSecret);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, authConfig.passwordSaltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authConfig
};
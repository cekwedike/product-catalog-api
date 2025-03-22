require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const rateLimit = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(rateLimit);
app.use('/api/auth', authRoutes);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', authMiddleware, productRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
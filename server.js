require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const authMiddleware = require('./middleware/authMiddleware');
const rateLimit = require('./middleware/rateLimit');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const path = require('path');
const securityHeaders = require('./middleware/securityHeaders');

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL || 'https://product-catalog-api-g5rv.onrender.com';

// CORS configuration
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(rateLimit);
app.use(securityHeaders);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route - serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Product Catalog API',
    version: '1.0.0',
    documentation: `${API_URL}/api-docs/`,
    endpoints: {
      auth: `${API_URL}/api/auth`,
      products: `${API_URL}/api/products`,
      categories: `${API_URL}/api/categories`
    }
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at ${API_URL}/api-docs/`);
    console.log(`API Documentation available at ${API_URL}/api-docs/`);
  });
});
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mentorRoutes = require('./routes/mentors');
const matchRoutes = require('./routes/matches');

// API routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', mentorRoutes);
app.use('/api', matchRoutes);

// Swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mentor-Mentee Matching API',
      version: '1.0.0',
      description: 'API for mentor-mentee matching application',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(specs));

// OpenAPI JSON endpoint
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/swagger-ui');
});

// Initialize database
const db = require('./config/database');
db.init();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI available at http://localhost:${PORT}/swagger-ui`);
  console.log(`📄 OpenAPI spec available at http://localhost:${PORT}/openapi.json`);
});

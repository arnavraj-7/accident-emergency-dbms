// ============================================================
// Express Server - Entry Point
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());                         // Allow cross-origin requests from React
app.use(express.json());                 // Parse JSON request bodies
app.use(morgan('dev'));                   // Log all HTTP requests (method, url, status, time)

// Routes
app.use('/api/accidents',  require('./routes/accidentRoutes'));
app.use('/api/victims',    require('./routes/victimRoutes'));
app.use('/api/vehicles',   require('./routes/vehicleRoutes'));
app.use('/api/responses',  require('./routes/responseRoutes'));

// Transaction demo route
app.use('/api/demo',       require('./routes/demoRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Emergency Response API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

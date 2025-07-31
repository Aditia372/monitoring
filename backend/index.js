const express = require('express');
const cors = require('cors');
const app = express();

// Route imports
const authRoutes = require('./routes/authRoutes');
const aircraftRoutes = require('./routes/aircraftRoutes');
const taskRoutes = require('./routes/taskRoutes'); // pastikan nama file: taskRoutes.js

// Middleware
app.use(cors());
app.use(express.json());

// Static file (untuk akses file upload)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', authRoutes);
app.use('/api', aircraftRoutes);
app.use('/api', taskRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

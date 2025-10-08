// backend/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const storefrontRoutes = require('./routes/storefrontRoutes');
const uploadRoutes = require("./routes/uploadRoutes");



dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // for parsing JSON requests
app.use('/api/auth', authRoutes);
app.use('/api/subscribe', require('./routes/subscribeRoutes'));
app.use('/api/profile', profileRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/storefront', storefrontRoutes);
app.use("/api/upload", uploadRoutes);



// Example route
app.get('/', (req, res) => {
  res.send('Vendra API is running');
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

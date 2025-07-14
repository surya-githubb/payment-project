const express = require('express');
const app = express();
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

app.use(express.json());

// Routes
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'faynPayment API is running' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`faynPayment mainApp running on port ${PORT}`);
});

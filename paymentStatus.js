const axios = require('axios');


paymentStatus = async (req, res) => {
  const { gateway } = req.body || {}; 
  const { orderId } = req.params;

  if (!gateway) {
    return res.status(422).json({ error: "Missing parameter gateway" });
  }

  const PG_SERVICE_URLS = {
  phonepe: `http://localhost:3000/api/payment/status/${orderId}`,
  paytm: 'http://localhost:5002/api/payment/status',
  razorpay: 'http://localhost:5003/api/payment/status',
};

  const url = PG_SERVICE_URLS[gateway];
  if (!url) return res.status(400).json({ error: 'Unsupported payment gateway' });

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ error: 'Failed to initiate payment via ' + gateway });
  }
};

module.exports = { paymentStatus };

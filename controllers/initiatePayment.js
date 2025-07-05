const axios = require('axios');

const PG_SERVICE_URLS = {
  phonepe: 'http://localhost:3000/api/payment/initiate',
  paytm: 'http://localhost:5002/api/payment/initiate',
  razorpay: 'http://localhost:5003/api/payment/initiate',
};

initiatePayment = async (req, res) => {
  const { gateway, amount, userId } = req.body;

  if(!gateway || !amount || !userId) {
    return res.status(422).json({ error: 'missing parameter'})
  }

  const url = PG_SERVICE_URLS[gateway];
  if (!url) return res.status(400).json({ error: 'Unsupported payment gateway' });

  try {
    const response = await axios.post(url, { amount, userId });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ error: 'Failed to initiate payment via ' + gateway });
  }
};

module.exports = { initiatePayment };

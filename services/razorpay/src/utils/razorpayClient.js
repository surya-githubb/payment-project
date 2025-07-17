require('dotenv').config(); // Make sure this is at the top

const Razorpay = require('razorpay');

const razorpayClient = new Razorpay({
  key_id: process.env.KEYID,
  key_secret: process.env.KEYSECRET
});

exports.razorpayClient = razorpayClient;

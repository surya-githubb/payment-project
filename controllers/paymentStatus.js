const axios = require('axios');


paymentStatus = async (req, res) => {
  const { gateway } = req.body || {};

  if (!gateway) {
    return res.status(422).json({ error: "Missing parameter gateway" });
  }

  const PG_SERVICE_URLS = {}; 

  if(gateway === 'phonepe') {
  const { orderId } = req.params; //phonepe
  if (!orderId) return res.status(422).json({ error: "Missing parameter: orderId" });
  PG_SERVICE_URLS.phonepe = `http://localhost:3000/api/payment/status/${orderId}`
  }
  
  else if(gateway === 'razorpay') {
  const { linkId } = req.query; //razorpay
  if (!linkId) return res.status(422).json({ error: "Missing parameter: linkId" });
  PG_SERVICE_URLS.razorpay = `http://localhost:3001/api/payment/status?linkId=${linkId}`
  }
  
  else if(gateway === 'paytm') {
  const { linkId } = req.query; //paytm
  if (!linkId) return res.status(422).json({ error: "Missing parameter: linkId" });
  PG_SERVICE_URLS.razorpay = `http://localhost:3002/api/payment/status?linkId=${linkId}`
  }
  
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

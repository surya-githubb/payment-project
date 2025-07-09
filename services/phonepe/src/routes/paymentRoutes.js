const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const phonePeClient = require('../utils/phonepeClient');
const { StandardCheckoutPayRequest, CreateSdkOrderRequest } = require('pg-sdk-node');

// Initiate payment via PhonePe checkout page
router.post('/initiate', async (req, res) => {
  try {
    const { amount, userId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const merchantOrderId = `ORDER_${uuidv4()}`;
    const redirectUrl = `${process.env.MERCHANT_REDIRECT_URL}?orderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100) // PhonePe expects amount in paise
      .redirectUrl(redirectUrl)
      .build();

    const response = await phonePeClient.getClient().pay(request);
    
    // In a real application, you would save the order details to your database here
    // await saveOrderToDatabase(merchantOrderId, amount, userId, 'PENDING');

    res.json({
      success: true,
      checkoutUrl: response.redirectUrl,
      orderId: merchantOrderId
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
});

// Create order for Frontend SDK integration
router.post('/create-sdk-order', async (req, res) => {
  try {
    const { amount, userId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const merchantOrderId = `ORDER_${uuidv4()}`;
    const redirectUrl = `${process.env.MERCHANT_REDIRECT_URL}?orderId=${merchantOrderId}`;

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(amount * 100) // PhonePe expects amount in paise
      .redirectUrl(redirectUrl)
      .build();

    const response = await phonePeClient.getClient().createSdkOrder(request);
    
    // Save order details to database
    // await saveOrderToDatabase(merchantOrderId, amount, userId, 'PENDING');

    res.json({
      success: true,
      token: response.token,
      orderId: merchantOrderId
    });
  } catch (error) {
    console.error('SDK order creation error:', error);
    res.status(500).json({ error: 'Order creation failed', details: error.message });
  }
});

// Check payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const response = await phonePeClient.getClient().getOrderStatus(orderId);
    
    // Update order status in your database based on response.state
    // await updateOrderStatus(orderId, response.state);

    res.json({
      success: true,
      status: response.state,
      data: response
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Status check failed', details: error.message });
  }
});



module.exports = router;

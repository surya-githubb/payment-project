const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const phonePeClient = require('../utils/phonepeClient');
const { Env, StandardCheckoutPayRequest, CreateSdkOrderRequest, RefundRequest } = require('pg-sdk-node');

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


// Refund controller
router.post('/refund', async (req, res) => {
  try {
    const { originalMerchantOrderId, amount } = req.body;

    if (!originalMerchantOrderId || !amount) {
      return res.status(400).json({ error: 'Missing orderId or amount' });
    }

    const refundId = uuidv4();

    const refundRequest = RefundRequest.builder()
      .amount(amount * 100) //PhonePe expects amount in paise 
      .merchantRefundId(refundId)
      .originalMerchantOrderId(originalMerchantOrderId)
      .build();

    const refundResponse = await phonePeClient.getClient().refund(refundRequest);
    console.log(refundResponse)

    return res.status(200).json({
      message: 'Refund initiated',
      refundId,
      state: refundResponse.state,
      amount: refundResponse.amount,
    });

  } catch (err) {
    console.error('PhonePe refund error:', err);
    return res.status(500).json({ error: 'Refund failed', details: err.message });
  }
});


router.get('/refund-status/:refundId', async (req, res) => {
  try {
    const { refundId } = req.params;

    if (!refundId) {
      return res.status(400).json({ error: 'Missing refundId in request params.' });
    }

    const response = await phonePeClient.getClient().getRefundStatus(refundId);
    console.log(response)
    const {
      merchantId,
      merchantRefundId,
      originalMerchantOrderId,
      amount,
      state,
      paymentDetails = [],
    } = response;

    return res.status(200).json({
      success: true,
      refund: {
        merchantId,
        refundId: merchantRefundId,
        orderId: originalMerchantOrderId,
        amount,
        status: state,
        attempts: paymentDetails.map(detail => ({
          transactionId: detail.transactionId,
          paymentMode: detail.paymentMode,
          timestamp: detail.timestamp,
          state: detail.state,
          errorCode: detail.errorCode || null,
          detailedErrorCode: detail.detailedErrorCode || null,
          instruments: detail.splitInstruments || [],
        })),
      },
    });
  } catch (error) {
    console.error('Refund status error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error',
    });
  }
});


module.exports = router;

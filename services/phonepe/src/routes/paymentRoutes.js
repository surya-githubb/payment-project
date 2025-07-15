const express = require('express');
const router = express.Router();
const { initiatePayment, createSdk, paymentStatus, refund, refundStatus} = require('../controllers/paymentController')

// Initiate payment via PhonePe checkout page
router.post('/initiate', initiatePayment);

// Create order for Frontend SDK integration
router.post('/create-sdk-order', createSdk);

// Check payment status
router.get('/status/:orderId', paymentStatus);

// Refund controller
router.post('/refund', refund);

//check refund-status
router.get('/refund-status/:refundId', refundStatus);


module.exports = router;

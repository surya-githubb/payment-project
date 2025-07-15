const express = require('express');
const router = express.Router();
const {initiatePayment} = require('../controllers/initiatePayment');
const {paymentStatus} = require('../controllers/paymentStatus');

router.post('/initiate', initiatePayment); // /initiate is same for all services

router.post('/status/:orderId', paymentStatus); // phonepe

router.post('/status', paymentStatus); // razorpay


module.exports = router;

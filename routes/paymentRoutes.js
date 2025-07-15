const express = require('express');
const router = express.Router();
const {initiatePayment} = require('../controllers/initiatePayment');
const {paymentStatus} = require('../controllers/paymentStatus');

router.post('/initiate', initiatePayment);

router.post('/status/:orderId', paymentStatus);

router.post('/status', paymentStatus);


module.exports = router;

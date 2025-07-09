const express = require('express');
const router = express.Router();
const {createPaymentLink} = require('../controllers/createPaymentLink');
const {checkStatus} = require('../controllers/checkStatus');


router.post('/initiate', createPaymentLink);

router.get('/status', checkStatus);

module.exports = router;

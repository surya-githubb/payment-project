const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const {razorpayClient} = require('../utils/razorpayClient');


// API Call for creating the order
exports.createOrder = async (req, res) => {
    console.log("Create order")
    console.log("body", req.body)
    try {
        const options = {
            amount: req.body.amount, // amount in the smallest currency unit, in our case ( INR ) we will be using paisa ( RS * 100) 
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7), //Unique and random receipt ID
        };

        const order = await razorpayClient.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { razorpayClient } = require('../utils/razorpayClient');

// API Call for creating the payment link (hosted checkout)
exports.createPaymentLink = async (req, res) => {
    console.log("Create Payment Link");
    console.log("body", req.body);

    try {
        const options = {
            amount: req.body.amount, // in paisa (e.g., 100 = ₹1)
            currency: 'INR',
            accept_partial: false,
            description: 'Payment for order',
            customer: {
                name: req.body.name || "Demo User",
                contact: req.body.contact || "9999999999",
                email: req.body.email || "demo@example.com"
            },
            notify: {
                sms: true,
                email: true
            },
            callback_url: "http://localhost:3000/payment-success", // replace with your actual route
            callback_method: "get"
        };

        const link = await razorpayClient.paymentLink.create(options);
        res.status(200).json(link); // contains link.short_url
    } catch (err) {
        console.error("Error creating payment link:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

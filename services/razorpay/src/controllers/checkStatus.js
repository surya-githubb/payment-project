const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const {razorpayClient} = require('../utils/razorpayClient');


// GET /check-status?linkId=Plinkxxxxx
exports.checkStatus = async (req, res) => {
  const { linkId } = req.query;

  try {
    const link = await razorpayClient.paymentLink.fetch(linkId);
    res.status(200).json(link); // shows status like "created", "paid", "cancelled"
  } catch (err) {
    console.error("Error fetching payment link status:", err);
    res.status(500).json({ error: "Failed to fetch payment link status" });
  }
};


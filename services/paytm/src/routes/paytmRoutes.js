const express = require("express");
const router = express.Router();
const {
  createPaymentLink,
  fetchPaymentLink,
} = require("../controllers/paytmLinkController");

router.post("/initiate", createPaymentLink);
router.post("/check-status", fetchPaymentLink);

module.exports = router;

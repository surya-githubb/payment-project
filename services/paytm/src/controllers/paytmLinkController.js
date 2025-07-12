const axios = require("axios");
const PaytmChecksum = require("paytmchecksum");
const { mid, key, env } = require("../utils/paytmConfig");

exports.createPaymentLink = async (req, res) => {
  try {
    const orderId = "ORDERID_" + Date.now();
    const amount = req.body.amount || "1.00";
    const customerEmail = req.body.email || "test@example.com";
    const customerMobile = req.body.mobile || "9999999999";

    const body = {
      mid,
      linkType: "GENERIC",
      linkDescription: "Test Payment",
      linkName: "TestPayment_" + Date.now(),
      amount,
      sendSms: true,
      sendEmail: true,
      customerContact: {
        customerEmail,
        customerMobile,
      },
      expiryDate: "", // optional
      notifyContact: {
        customerEmail,
        customerMobile,
      },
      redirectUrl: "http://localhost:3000/payment-status",
    };

    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(body), key);

    const payload = {
      head: {
        signature: checksum,
        tokenType: "AES",
      },
      body,
    };

    const { data } = await axios.post(`${env}/link/create`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.json({ success: true, linkData: data.body });
  } catch (error) {
    console.error("Create Link Error:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Create link failed" });
  }
};

exports.fetchPaymentLink = async (req, res) => {
  try {
    const linkId = req.body.linkId;

    const body = {
      mid,
      linkId,
    };

    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(body), key);

    const payload = {
      head: {
        signature: checksum,
        tokenType: "AES",
      },
      body,
    };

    const { data } = await axios.post(`${env}/link/fetch`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.json({ success: true, linkData: data.body });
  } catch (error) {
    console.error("Fetch Link Error:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Fetch link failed" });
  }
};

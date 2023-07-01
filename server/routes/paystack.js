const express = require('express');
const paystack = require('paystack-api');

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_API;

// Initialize Paystack instance
const paystackInstance = paystack(PAYSTACK_SECRET_KEY);

// Handle payment request
router.post('/payment', async (req, res) => {
  try {
    const { email, amount, reference, currency="GHS" } = req.body;

    // Initialize transaction
    const transaction = await paystackInstance.transaction.initialize({
      email,
      amount: amount * 100, 
      reference,
      currency,
      
    });

    const { authorization_url } = transaction.data;

    // Redirect user to Paystack's payment page
    res.redirect(authorization_url);
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'An error occurred while initiating payment' });
  }
});

// Handle payment verification
router.get('/verify', async (req, res) => {
  try {
    const { reference } = req.query;

    // Verify payment on Paystack
    const verification = await paystackInstance.transaction.verify(reference);

    const { status, data } = verification.data;

    if (status === 'success') {
      // Payment is successful
      res.json({ message: 'Payment successful', data });
    } else {
      // Payment failed
      res.status(400).json({ message: 'Payment failed', data });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'An error occurred while verifying payment' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cache = require('../middleware/cache');

// Get all subscription plans
router.get('/plans', verifyToken, cache, (req, res) => {
  db.query('SELECT * FROM subscription_plans', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Create a subscription
router.post('/create', verifyToken, async (req, res) => {
  const { planId, paymentMethodId } = req.body;
  const userId = req.userId;

  try {
    const plan = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM subscription_plans WHERE id = ?', [planId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });

    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: req.userEmail, // Assuming user email is available in req
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: plan.stripe_plan_id }],
      expand: ['latest_invoice.payment_intent'],
    });

    db.query(
      'INSERT INTO subscriptions (user_id, plan_id, stripe_subscription_id, status, start_date, end_date) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?))',
      [userId, planId, subscription.id, subscription.status, subscription.current_period_start, subscription.current_period_end],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.json({ subscription });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
router.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const session = event.data.object;
      // Update subscription status in the database
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});


module.exports = router;

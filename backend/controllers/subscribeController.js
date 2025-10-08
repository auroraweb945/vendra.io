// backend/controllers/subscriptionController.js
const pool = require('../config/db');

// Basic plan info
const plans = {
  basic: { firstMonth: 5, recurring: 10 }
};

// Create a subscription entry (manual activation later)
exports.initiateSubscription = async (req, res) => {
  const userId = req.user.id;
  const selectedPlan = 'basic'; // hardcoded for now
  const price = plans[selectedPlan].firstMonth;

  try {
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, price, status, is_first_payment, subscribed_at, expires_at)
       VALUES ($1, $2, $3, 'pending', true, NOW(), NOW() + INTERVAL '1 month')`,
      [userId, selectedPlan, price]
    );

    // Instead of redirecting to Whish, just send a contact message
    return res.json({
      message: 'Subscription request created. Please contact admin to activate.'
    });
  } catch (err) {
    console.error('Error initiating subscription:', err);
    return res.status(500).json({ error: 'Failed to initiate subscription' });
  }
};

// Manually activate subscription (you can call this from pgAdmin or later via an admin route)
exports.activateSubscription = async (req, res) => {
  const { userId } = req.body;

  try {
    await pool.query(
      `UPDATE subscriptions
       SET status = 'active', subscribed_at = NOW(), expires_at = NOW() + INTERVAL '1 month'
       WHERE user_id = $1
       ORDER BY id DESC
       LIMIT 1`,
      [userId]
    );

    return res.json({ message: 'Subscription activated successfully' });
  } catch (err) {
    console.error('Error activating subscription:', err);
    return res.status(500).json({ error: 'Failed to activate subscription' });
  }
};

// Get subscription status
exports.getSubscriptionStatus = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT plan, price, status, expires_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({
        status: 'inactive',
        plan: null,
        price: null,
        expires_at: null
      });
    }

    const sub = rows[0];
    return res.json({
      plan: sub.plan,
      price: sub.price,
      status: sub.status,
      expires_at: sub.expires_at
    });
  } catch (err) {
    console.error('Failed to fetch subscription:', err);
    return res.status(500).json({ error: 'Failed to retrieve subscription status' });
  }
};

// backend/middleware/checkSubscription.js
const pool = require('../config/db');

const checkSubscription = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT * FROM subscriptions
       WHERE user_id = $1 AND status = 'active'
       ORDER BY subscribed_at DESC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({
        error: 'You must subscribe to access this feature.'
      });
    }

    const subscription = rows[0];
    const now = new Date();

    if (new Date(subscription.expires_at) < now) {
      return res.status(403).json({
        error: 'Your subscription has expired. Please renew to continue.'
      });
    }

    // ✅ Valid subscription
    req.subscription = subscription;
    next();
  } catch (err) {
    console.error('Subscription check error:', err);
    return res.status(500).json({ error: 'Subscription validation failed' });
  }
};

module.exports = checkSubscription;

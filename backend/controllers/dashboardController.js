// backend/controllers/dashboardController.js
const { findStoreByUserId } = require('../models/storeModel');
const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const storeResult = await findStoreByUserId(userId);
    if (!storeResult.rows || storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const storeId = storeResult.rows[0].id;
    const stats = {};

    // 1. Sales count (delivered orders)
    const { rows: salesResult } = await pool.query(
      `SELECT COUNT(*) AS salesCount FROM orders WHERE store_id = $1 AND status = 'delivered'`,
      [storeId]
    );
    stats.salesCount = parseInt(salesResult[0].salescount, 10);

    // 2. Revenue chart for last 7 days (Postgres date_series)
    const { rows: revenueResult } = await pool.query(
      `
      SELECT d::date AS date, 
             COALESCE(SUM(o.total_price), 0) AS revenue
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days', 
        CURRENT_DATE, 
        '1 day'
      ) d
      LEFT JOIN orders o 
        ON DATE(o.delivered_at) = d::date 
        AND o.status = 'delivered' 
        AND o.store_id = $1
      GROUP BY d
      ORDER BY d ASC
      `,
      [storeId]
    );
    stats.revenueChart = revenueResult;

    // 3. Total product count
    const { rows: productResult } = await pool.query(
      `SELECT COUNT(*) AS productCount FROM products WHERE store_id = $1 AND deleted = FALSE`,
      [storeId]
    );
    stats.productCount = parseInt(productResult[0].productcount, 10);

    // 4. Low stock products
    const { rows: lowStockResult } = await pool.query(
      `SELECT id, name, stock 
       FROM products 
       WHERE store_id = $1 AND stock <= 5 AND deleted = FALSE`,
      [storeId]
    );
    stats.lowStock = lowStockResult;

    // 5. Recent 7 orders
    const { rows: recentOrders } = await pool.query(
      `SELECT id, customer_name, phone, total_price, status, created_at
       FROM orders
       WHERE store_id = $1
       ORDER BY created_at DESC
       LIMIT 7`,
      [storeId]
    );
    stats.recentOrders = recentOrders;

    return res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

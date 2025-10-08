// backend/models/orderModel.js
const pool = require('../config/db');

// Create a new order with transaction
const createOrder = async (storeId, orderData) => {
  const client = await pool.connect();
  try {
    const { customer_name, customer_email, location, phone, payment_method, items, total_price } = orderData;

    await client.query('BEGIN');

    // Validate stock
    for (const item of items) {
      const { rows } = await client.query(
        'SELECT stock FROM products WHERE id = $1 AND deleted = FALSE',
        [item.product_id]
      );
      if (rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }
      if (rows[0].stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}. Available: ${rows[0].stock}, Requested: ${item.quantity}`);
      }
    }

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (store_id, customer_name, customer_email, location, phone, payment_method, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [storeId, customer_name, customer_email, location, phone, payment_method, total_price]
    );
    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, selected_size, selected_color)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.quantity, item.price, item.selected_size || null, item.selected_color || null]
      );

      // Update stock
      const updateResult = await client.query(
        `UPDATE products SET stock = stock - $1 
         WHERE id = $2 AND deleted = FALSE AND stock >= $1`,
        [item.quantity, item.product_id]
      );
      if (updateResult.rowCount === 0) {
        throw new Error(`Failed to update stock for product ID ${item.product_id}`);
      }
    }

    await client.query('COMMIT');
    return { insertId: orderId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Get orders with optional filters
const getOrdersByStoreId = async (storeId, filters = {}) => {
  let query = 'SELECT * FROM orders WHERE store_id = $1';
  const params = [storeId];
  let paramIndex = 2;

  if (filters.customer_name) {
    query += ` AND customer_name ILIKE $${paramIndex++}`;
    params.push(`%${filters.customer_name}%`);
  }

  if (filters.customer_phone) {
    query += ` AND phone ILIKE $${paramIndex++}`;
    params.push(`%${filters.customer_phone}%`);
  }

  if (filters.status) {
    query += ` AND status = $${paramIndex++}`;
    params.push(filters.status);
  }

  query += ' ORDER BY created_at DESC';

  const { rows } = await pool.query(query, params);
  return rows;
};

// Get order details
const getOrderDetails = async (orderId) => {
  const { rows: orders } = await pool.query(
    'SELECT * FROM orders WHERE id = $1',
    [orderId]
  );
  if (orders.length === 0) throw new Error('Order not found');

  const { rows: items } = await pool.query(
    `SELECT 
       oi.product_id, 
       p.name AS product_name, 
       oi.quantity, 
       oi.price,
       oi.selected_size,
       oi.selected_color
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  return { ...orders[0], items };
};

// Update order status
const updateOrderStatus = async (orderId, storeId, status) => {
  let query, values;

  if (status === 'delivered') {
    query = `UPDATE orders SET status = $1, delivered_at = NOW() WHERE id = $2 AND store_id = $3`;
    values = [status, orderId, storeId];
  } else {
    query = `UPDATE orders SET status = $1 WHERE id = $2 AND store_id = $3`;
    values = [status, orderId, storeId];
  }

  const { rowCount } = await pool.query(query, values);
  return rowCount;
};

// Get store order stats
const getOrderStats = async (storeId) => {
  const { rows } = await pool.query(
    `SELECT 
       COUNT(*) AS total_orders, 
       COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_price ELSE 0 END), 0) AS total_revenue 
     FROM orders 
     WHERE store_id = $1`,
    [storeId]
  );
  return rows[0];
};

module.exports = {
  createOrder,
  getOrdersByStoreId,
  getOrderDetails,
  updateOrderStatus,
  getOrderStats,
};

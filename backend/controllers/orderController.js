// backend/controllers/orderController.js
const {
  createOrder,
  getOrdersByStoreId,
  getOrderDetails,
  updateOrderStatus,
  getOrderStats,
} = require('../models/orderModel');
const { findStoreByUserId, getStoreBySlug } = require('../models/storeModel');

exports.createOrder = async (req, res) => {
  const { store_slug, customer_name, customer_email, location, phone, payment_method, items, total_price } = req.body;

  if (!store_slug) return res.status(400).json({ error: 'Store slug is required' });

  if (payment_method !== 'cash_on_delivery') {
    return res.status(400).json({ error: 'Only cash on delivery is currently supported' });
  }

  try {
    const storeResult = await getStoreBySlug(store_slug);
    if (!storeResult.rows || storeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Store not found' });
    }

    const storeId = storeResult.rows[0].id;
    const normalizedItems = (items || []).map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selected_size,
      selected_color: item.selected_color
    }));

    const result = await createOrder(storeId, {
      customer_name,
      customer_email,
      location,
      phone,
      payment_method,
      items: normalizedItems,
      total_price
    });

    res.status(201).json({ message: 'Order placed successfully', orderId: result.insertId });
  } catch (err) {
    if (err.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// getOrders
exports.getOrders = async (req, res) => {
  try {
    const storeResult = await findStoreByUserId(req.user.id);

    if (!storeResult.rows || storeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Store not found' });
    }

    const filters = {
      customer_name: req.query.customer_name,
      customer_phone: req.query.customer_phone,
      status: req.query.status,
    };

    const orders = await getOrdersByStoreId(storeResult.rows[0].id, filters);
    res.json({ orders, count: orders.length });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await getOrderDetails(orderId);
    res.json({ order });
  } catch (err) {
    res.status(404).json({ error: 'Order not found' });
  }
};

// updateOrderStatus
exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'shipped', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const storeResult = await findStoreByUserId(req.user.id);

    if (!storeResult.rows || storeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Store not found' });
    }

    const updated = await updateOrderStatus(orderId, storeResult.rows[0].id, status);
    if (updated === 0) return res.status(404).json({ error: 'Order not found' });

    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// getOrderStats
exports.getOrderStats = async (req, res) => {
  try {
    const storeResult = await findStoreByUserId(req.user.id);

    if (!storeResult.rows || storeResult.rows.length === 0) {
      return res.status(400).json({ error: 'Store not found' });
    }

    const stats = await getOrderStats(storeResult.rows[0].id);
    res.json({ stats });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

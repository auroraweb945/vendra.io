// backend/controllers/storefrontController.js
const pool = require('../config/db');

exports.getStorefrontData = async (req, res) => {
  const slug = req.params.slug;

  try {
    // 1. Get store by slug
    const storeResult = await pool.query(
      'SELECT * FROM stores WHERE slug = $1',
      [slug]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const storeData = storeResult.rows[0];

    // 2. Get products for this store
    const productsResult = await pool.query(
      'SELECT * FROM products WHERE store_id = $1 AND deleted = FALSE',
      [storeData.id]
    );

    // Parse JSON fields safely
    const products = productsResult.rows.map((p) => ({
      ...p,
      available_colors: p.available_colors || [],
      available_sizes: p.available_sizes || [],
      stock_alert:
        p.stock === 0
          ? 'Out of Stock'
          : p.stock <= 5
          ? 'Low Stock'
          : null,
    }));

    // 3. Return storefront data
    res.json({
      store: {
        name: storeData.name,
        logo_url: storeData.logo_url,
        description: storeData.description,
        about: storeData.about ? JSON.parse(storeData.about) : [],
        background_url: storeData.background_url || '',
        feedbacks: storeData.feedbacks ? JSON.parse(storeData.feedbacks) : [],
        contact_number: storeData.contact_number || null
      },
      products,
    });
  } catch (err) {
    console.error('Error fetching storefront data:', err);
    res.status(500).json({ error: 'Failed to fetch storefront data' });
  } 
};

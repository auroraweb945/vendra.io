const db = require('../config/db');

// Create Store
const createStore = async (store) => {
  const { user_id, name, slug, description, logo_url, about, background_url, feedbacks, contact_number } = store;
  const query = `
    INSERT INTO stores (user_id, name, slug, description, logo_url, about, background_url, feedbacks, contact_number) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    user_id,
    name,
    slug,
    description,
    logo_url,
    about ? JSON.stringify(about) : '[]',
    background_url,
    feedbacks ? JSON.stringify(feedbacks) : '[]',
    contact_number || null
  ];
  return db.query(query, values);
};

// Find store by user ID
const findStoreByUserId = async (userId) => {
  const query = `SELECT * FROM stores WHERE user_id = $1`;
  return db.query(query, [userId]);
};

// Update store
const updateStore = async (userId, updates) => {
  const { name, slug, description, logo_url, about, background_url, feedbacks, contact_number } = updates;
  const query = `
    UPDATE stores 
    SET name = $1, slug = $2, description = $3, logo_url = $4, about = $5, background_url = $6, feedbacks = $7, contact_number = $8, updated_at = NOW()
    WHERE user_id = $9
    RETURNING *;
  `;
  const values = [
    name,
    slug,
    description,
    logo_url,
    about ? JSON.stringify(about) : '[]',
    background_url,
    feedbacks ? JSON.stringify(feedbacks) : '[]',
    contact_number || null,
    userId
  ];
  return db.query(query, values);
};

// Get store by slug
const getStoreBySlug = async (slug) => {
  const query = `SELECT * FROM stores WHERE slug = $1`;
  return db.query(query, [slug]);
};

module.exports = {
  createStore,
  findStoreByUserId,
  updateStore,
  getStoreBySlug,
};
 
// backend/models/productModel.js 
const db = require('../config/db'); 

// Create Product 
const createProduct = async (storeId, product) => { 
  const { name, price, description, stock, image_url, available_sizes, available_colors } = product; 

  const query = ` 
    INSERT INTO products (store_id, name, price, description, stock, image_url, available_sizes, available_colors) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING id; 
  `; 

  const values = [ 
    storeId, 
    name, 
    price, 
    description, 
    stock, 
    image_url, 
    available_sizes ? JSON.stringify(available_sizes) : JSON.stringify([]), 
    available_colors ? JSON.stringify(available_colors) : JSON.stringify([]) 
  ]; 

  return db.query(query, values); 
}; 

// Get products by store 
const getProductsByStoreId = async (storeId) => { 
  const query = `SELECT * FROM products WHERE store_id = $1 AND deleted = FALSE`; 
  const result = await db.query(query, [storeId]); 

  return result.rows.map(product => ({ 
    ...product, 
    available_sizes: product.available_sizes || [], 
    available_colors: product.available_colors || [] 
  })); 
}; 

// Get product by ID 
const getProductById = async (productId) => { 
  const query = `SELECT * FROM products WHERE id = $1 AND deleted = FALSE`; 
  const result = await db.query(query, [productId]); 

  if (result.rows.length > 0) { 
    const product = result.rows[0]; 
    return { 
      ...product, 
      available_sizes: product.available_sizes || [], 
      available_colors: product.available_colors || [] 
    }; 
  } 
  return null; 
}; 

// Update product 
const updateProduct = async (productId, updates) => { 
  const { name, price, description, stock, image_url, available_sizes, available_colors } = updates; 

  const query = ` 
    UPDATE products 
    SET name = $1, price = $2, description = $3, stock = $4, image_url = $5, 
        available_sizes = $6, available_colors = $7, updated_at = NOW() 
    WHERE id = $8 AND deleted = FALSE 
    RETURNING *; 
  `; 

  const values = [ 
    name, 
    price, 
    description, 
    stock, 
    image_url, 
    available_sizes ? JSON.stringify(available_sizes) : JSON.stringify([]), 
    available_colors ? JSON.stringify(available_colors) : JSON.stringify([]), 
    productId 
  ]; 

  return db.query(query, values); 
}; 

// Soft delete product 
const deleteProduct = async (productId) => { 
  const query = `UPDATE products SET deleted = TRUE WHERE id = $1 RETURNING *;`; 
  return db.query(query, [productId]); 
}; 

// Low stock products 
const getLowStockProducts = async (storeId, threshold) => { 
  const query = `SELECT * FROM products WHERE store_id = $1 AND stock <= $2 AND deleted = FALSE`; 
  return db.query(query, [storeId, threshold]); 
}; 

// Count products in store 
const countProductsByStoreId = async (storeId) => { 
  const query = `SELECT COUNT(*) AS count FROM products WHERE store_id = $1 AND deleted = FALSE`; 
  const result = await db.query(query, [storeId]); 
  return parseInt(result.rows[0].count, 10); 
}; 

// Count products by user 
const getProductCountByUserId = async (userId) => { 
  const query = ` 
    SELECT COUNT(p.id) AS product_count 
    FROM products p 
    JOIN stores s ON p.store_id = s.id 
    WHERE s.user_id = $1 AND p.deleted = FALSE 
  `; 
  return db.query(query, [userId]); 
}; 

// Update stock after order 
const updateProductStock = async (productId, quantity) => { 
  const query = ` 
    UPDATE products 
    SET stock = stock - $1 
    WHERE id = $2 AND deleted = FALSE AND stock >= $1 
    RETURNING *; 
  `; 
  const result = await db.query(query, [quantity, productId]); 
  if (result.rowCount === 0) throw new Error('Insufficient stock or product not found'); 
  return result; 
}; 

module.exports = { 
  createProduct, 
  getProductsByStoreId, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getLowStockProducts, 
  countProductsByStoreId, 
  getProductCountByUserId, 
  updateProductStock, 
};

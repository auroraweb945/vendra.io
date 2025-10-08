// backend/controllers/productController.js 
const { 
  createProduct, 
  getProductsByStoreId, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getLowStockProducts, 
  countProductsByStoreId, 
  getProductCountByUserId, 
} = require('../models/productModel'); 
const { findStoreByUserId } = require('../models/storeModel'); 

// Create Product 
exports.createProduct = async (req, res) => { 
  const { name, price, description, stock, image_url, available_sizes, available_colors } = req.body; 

  try { 
    const storeRes = await findStoreByUserId(req.user.id); 
    if (storeRes.rows.length === 0) return res.status(400).json({ error: 'Store not found' }); 

    const store = storeRes.rows[0]; 

    const count = await countProductsByStoreId(store.id); 
    if (count >= 20) { 
      return res.status(403).json({ error: 'Product limit reached (20 max)' }); 
    } 

    const result = await createProduct(store.id, { 
      name, 
      price, 
      description, 
      stock, 
      image_url, 
      available_sizes, 
      available_colors 
    }); 

    res.status(201).json({ message: 'Product created successfully', productId: result.rows[0].id }); 
  } catch (err) { 
    console.error('Create product error:', err); 
    res.status(500).json({ error: 'Failed to create product' }); 
  } 
}; 

// Get products 
exports.getProducts = async (req, res) => { 
  try { 
    const storeRes = await findStoreByUserId(req.user.id); 
    if (storeRes.rows.length === 0) return res.status(400).json({ error: 'Store not found' }); 

    const store = storeRes.rows[0]; 
    const products = await getProductsByStoreId(store.id); 

    res.json(products); 
  } catch (err) { 
    console.error('Get products error:', err); 
    res.status(500).json({ error: 'Failed to fetch products' }); 
  } 
}; 

// Update product 
exports.updateProduct = async (req, res) => { 
  const productId = req.params.id; 
  const { name, price, description, stock, image_url, available_sizes, available_colors } = req.body; 

  try { 
    const product = await getProductById(productId); 
    if (!product) return res.status(404).json({ error: 'Product not found or deleted' }); 

    await updateProduct(productId, { name, price, description, stock, image_url, available_sizes, available_colors }); 
    res.json({ message: 'Product updated successfully' }); 
  } catch (err) { 
    console.error('Update product error:', err); 
    res.status(500).json({ error: 'Failed to update product' }); 
  } 
}; 

// Delete product 
exports.deleteProduct = async (req, res) => { 
  const productId = req.params.id; 

  try { 
    const product = await getProductById(productId); 
    if (!product) return res.status(404).json({ error: 'Product not found or deleted' }); 

    await deleteProduct(productId); 
    res.json({ message: 'Product deleted successfully' }); 
  } catch (err) { 
    console.error('Delete product error:', err); 
    res.status(500).json({ error: 'Failed to delete product' }); 
  } 
}; 

// Low stock products 
exports.getLowStockProducts = async (req, res) => { 
  const threshold = parseInt(req.query.threshold) || 5; 

  try { 
    const storeRes = await findStoreByUserId(req.user.id); 
    if (storeRes.rows.length === 0) return res.status(400).json({ error: 'Store not found' }); 

    const store = storeRes.rows[0]; 
    const result = await getLowStockProducts(store.id, threshold); 

    res.json(result.rows); 
  } catch (err) { 
    console.error('Low stock error:', err); 
    res.status(500).json({ error: 'Failed to fetch low stock products' }); 
  } 
}; 

// Count products 
exports.getProductCount = async (req, res) => { 
  try { 
    const result = await getProductCountByUserId(req.user.id); 
    const count = result.rows[0]?.product_count || 0; 
    res.json({ count }); 
  } catch (err) { 
    console.error('Count products error:', err); 
    res.status(500).json({ error: 'Failed to count products' }); 
  } 
};

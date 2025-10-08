// src/pages/Product.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/product.css';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import DeleteProductModal from '../components/DeleteProductModal';
import LowStockModal from '../components/LowStockModal';
import ProductDetailModal from '../components/ProductDetailModal';
import useAuthGuard from '../hooks/useAuthGuard';
import useSubscriptionGuard from '../hooks/useSubscriptionGuard';
import Sidebar from "../components/Sidebar";

const Product = () => {
  const { checking: authChecking, user } = useAuthGuard();
  const { loading: subscriptionLoading } = useSubscriptionGuard();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);


  const token = localStorage.getItem('token');

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError('Failed to fetch products.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/low-stock', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLowStockProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch low stock products');
    }
  };

  const fetchCounts = async () => {
    try {
      const [totalRes, lowStockRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products/count', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5000/api/products/low-stock?threshold=5', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      setTotalCount(totalRes.data.count);
      setLowStockCount(lowStockRes.data.length);
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  };  

  useEffect(() => {
    fetchProducts();
    fetchCounts(); // <-- add this line
    fetchLowStockProducts();
  }, []);

  const handleProductAdded = () => {
    setLoading(true);
    fetchProducts();
    fetchLowStockProducts();
  };

  if (authChecking) return <p>Checking authentication...</p>;
  if (subscriptionLoading) return <p>Checking subscription...</p>;

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <div className="page-content">
        <div className="product-container">
          <h2>Product Management</h2>

          <div className="summary-boxes">
            <div className="summary-box total-box">
              <h4>📦 Total Products</h4>
              <p>{totalCount}</p>
            </div>
            <div className="summary-box low-stock-box">
              <h4>⚠️ Low Stock</h4>
              <p>{lowStockCount}</p>
            </div>
          </div>



          {lowStockProducts.length > 0 && (
            <div className="low-stock-alert">
              ⚠️ {lowStockProducts.length} product(s) low in stock
              <button
                style={{ marginLeft: '10px', padding: '5px 10px' }}
                onClick={() => setShowLowStockModal(true)}
              >
                View
              </button>
            </div>
          )}

          <button className="save-btn" style={{ marginBottom: '20px' }} onClick={() => setShowModal(true)}>
            + Add Product
          </button>
          {showModal && (
            <AddProductModal
              onClose={() => setShowModal(false)}
              onProductAdded={handleProductAdded}
            />
          )}
          {loading && <p>Loading products...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p>No products found.</p>
          )}
          {!loading && !error && products.length > 0 && (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price ($)</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img
                        src={prod.image_url || 'https://via.placeholder.com/50'}
                        alt={prod.name}
                        className="product-image"
                      />
                    </td>
                    <td>{prod.name}</td>
                    <td>{prod.price}</td>
                    <td>
                      {prod.stock <= 5 ? (
                        <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                          ⚠️ {prod.stock}
                        </span>
                      ) : (
                        prod.stock
                      )}
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedProduct(prod)}
                      >
                        View
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingProduct(prod)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => setDeletingProduct(prod)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {editingProduct && (
            <EditProductModal
              product={editingProduct}
              onClose={() => setEditingProduct(null)}
              onProductUpdated={handleProductAdded}
            />
          )}
          {deletingProduct && (
            <DeleteProductModal
              product={deletingProduct}
              onClose={() => setDeletingProduct(null)}
              onProductDeleted={handleProductAdded}
            />
          )}

          {showLowStockModal && (
            <LowStockModal
              products={lowStockProducts}
              onClose={() => setShowLowStockModal(false)}
            />
          )}

          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default Product;

// src/components/LowStockModal.jsx
import React from 'react';
import '../styles/modal.css';

const LowStockModal = ({ products, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>⚠️ Low Stock Products</h3>
        <ul className="low-stock-list">
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> — Stock: {product.stock}
            </li>
          ))}
        </ul>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LowStockModal;

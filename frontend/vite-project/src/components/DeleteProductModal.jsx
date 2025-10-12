// src/components/DeleteProductModal.jsx
import React from 'react';
import axios from 'axios';
import '../styles/modal.css';

const DeleteProductModal = ({ product, onClose, onProductDeleted }) => {
  const token = localStorage.getItem('token');

  const handleDelete = async () => {
    try {
      await axios.delete(`https://vendra-io.onrender.com/api/products/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onProductDeleted(); // refresh list
      onClose();          // close modal
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal confirm">
        <h3>Delete Product</h3>
        <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
        <div className="modal-actions">
          <button className="delete-btn" onClick={handleDelete}>Yes, Delete</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;

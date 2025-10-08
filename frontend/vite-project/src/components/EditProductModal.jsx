// src/components/EditProductModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/modal.css';

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [form, setForm] = useState({ ...product });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setForm({ ...product });
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Sizes
  const handleSizeChange = (e) => {
    setForm({
      ...form,
      available_sizes: e.target.value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    });
  };

  // Colors
  const handleAddColor = () => {
    setForm({
      ...form,
      available_colors: [...(form.available_colors || []), '#000000'],
    });
  };

  const handleColorChange = (index, value) => {
    const updated = [...(form.available_colors || [])];
    updated[index] = value;
    setForm({ ...form, available_colors: updated });
  };

  const handleRemoveColor = (index) => {
    setForm({
      ...form,
      available_colors: form.available_colors.filter((_, i) => i !== index),
    });
  };

  // Image upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      console.error(err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${product.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error('Edit error:', err);
      setError('Failed to update product.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Product</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            step="0.01"
            placeholder="Price"
            required
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
          />

          {/* Sizes */}
          <label>Available Sizes (up to 3)</label>
          <div className="sizes-inputs">
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                type="text"
                placeholder={`Size ${i + 1}`}
                value={form.available_sizes?.[i] || ''}
                onChange={(e) => {
                  const updated = [...(form.available_sizes || [])];
                  updated[i] = e.target.value.trim();
                  const cleaned = updated.filter((s) => s);
                  setForm({ ...form, available_sizes: cleaned });
                }}
              />
            ))}
          </div>

          {/* Colors */}
          <label>Available Colors</label>
          <button type="button" onClick={handleAddColor}>+ Add Color</button>
          <div className="color-list">
            {form.available_colors?.map((color, index) => (
              <div key={index} className="color-item">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
                <span
                  className="color-preview"
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: color,
                    margin: '0 8px',
                  }}
                ></span>
                <span>{color}</span>
                <button type="button" onClick={() => handleRemoveColor(index)}>❌</button>
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {uploading && <p>Uploading...</p>}
          {form.image_url && (
            <img src={form.image_url} alt="Preview" style={{ width: '100px', marginTop: '10px', borderRadius: '6px' }} />
          )}

          {error && <p className="error-text">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Save Changes'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
// src/components/AddProductModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/modal.css';

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image_url: '',
    available_sizes: [],
    available_colors: [],
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Size handling
  const handleSizeChange = (e) => {
    setForm({
      ...form,
      available_sizes: e.target.value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s),
    });
  };

  // Color handling
  const handleAddColor = () => {
    setForm({
      ...form,
      available_colors: [...form.available_colors, '#000000'], // default black
    });
  };

  const handleColorChange = (index, value) => {
    const updated = [...form.available_colors];
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
      const res = await axios.post('https://vendra-io.onrender.com/api/upload', formDataUpload, {
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
      const res = await axios.post('https://vendra-io.onrender.com/api/products', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        onProductAdded();
        onClose();
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Product limit reached (20 max).');
      } else {
        setError(err.response?.data?.error || 'Failed to add product.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create New Product</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            step="0.01"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
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
                value={form.available_sizes[i] || ''}
                onChange={(e) => {
                  const updated = [...form.available_sizes];
                  updated[i] = e.target.value.trim();
                  // remove empty strings
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
            {form.available_colors.map((color, index) => (
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
              {uploading ? 'Uploading...' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
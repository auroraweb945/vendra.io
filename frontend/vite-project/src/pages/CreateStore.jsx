// src/pages/CreateStore.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/createstore.css';
import { useNavigate } from 'react-router-dom';

const CreateStore = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    about: [''], // 🟢 now an array of offers instead of one string
    logo_url: '',
    background_url: '',
    feedbacks: [{ author: '', message: '' }],
  });

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟢 Handle offer changes
  const handleOfferChange = (index, value) => {
    const updatedOffers = [...form.about];
    updatedOffers[index] = value;
    setForm({ ...form, about: updatedOffers });
  };

  const addOfferField = () => {
    if (form.about.length < 3) {
      setForm({ ...form, about: [...form.about, ''] });
    }
  };

  const removeOfferField = (index) => {
    const updated = [...form.about];
    updated.splice(index, 1);
    setForm({ ...form, about: updated });
  };

  // Feedback handling
  const handleFeedbackChange = (index, field, value) => {
    const updatedFeedbacks = [...form.feedbacks];
    updatedFeedbacks[index][field] = value;
    setForm({ ...form, feedbacks: updatedFeedbacks });
  };

  const addFeedbackField = () => {
    if (form.feedbacks.length < 3) {
      setForm({ ...form, feedbacks: [...form.feedbacks, { author: '', message: '' }] });
    }
  };

  const removeFeedbackField = (index) => {
    const updated = [...form.feedbacks];
    updated.splice(index, 1);
    setForm({ ...form, feedbacks: updated });
  };

  // Image upload handler
  const handleFileUpload = async (e, fieldName) => {
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

      setForm((prev) => ({ ...prev, [fieldName]: res.data.url }));
      setMsg('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    const requiredFields = ['name', 'slug', 'description', 'logo_url', 'background_url'];
    const missingFields = requiredFields.filter((field) => !form[field]?.trim?.() && !form[field]?.length);

    if (missingFields.length > 0) {
      setError('Please fill in all required fields before submitting.');
      return;
    }

    try {
      const res = await axios.post(
        'https://vendra-io.onrender.com/api/store/create',
        {
          ...form,
          about: JSON.stringify(form.about.filter((o) => o.trim() !== '')), // 🟢 send offers array as JSON string
          feedbacks: form.feedbacks.filter((f) => f.author || f.message),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg(res.data.message);
      navigate(`/store/${form.slug}`);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate('/subscribe-required');
      } else {
        setError(err.response?.data?.error || 'Failed to create store');
      }
    }
  };

  return (
    <div className="create-store-container">
      <h2>Create Your Store</h2>
      {msg && <p className="success-msg">{msg}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="create-store-form">
        <label>Store Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleInputChange} required />

        <label>Slug (URL ID):</label>
        <input type="text" name="slug" value={form.slug} onChange={handleInputChange} required />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          maxLength={100}
        />
        <small>{form.description.length}/100 characters</small>

        {/* 🟢 Offers Section */}
        <label>About (What You Offer):</label>
        {form.about.map((offer, index) => (
          <div key={index} className="offer-input">
            <input
              type="text"
              placeholder={`Offer ${index + 1}`}
              value={offer}
              onChange={(e) => handleOfferChange(index, e.target.value)}
              maxLength={80}
            />
            {form.about.length > 1 && (
              <button
                type="button"
                className="remove-offer-btn"
                onClick={() => removeOfferField(index)}
              >
                ✖
              </button>
            )}
          </div>
        ))}
        {form.about.length < 3 && (
          <button type="button" onClick={addOfferField} className="add-offer-btn">
            + Add Offer
          </button>
        )}

        {/* Logo Upload */}
        <label>Logo</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {form.logo_url && (
            <img
              src={form.logo_url}
              alt="Logo preview"
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} />
        </div>

        {/* Background Upload */}
        <label>Background Image</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {form.background_url && (
            <img
              src={form.background_url}
              alt="Background preview"
              style={{ width: 120, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
            />
          )}
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'background_url')} />
        </div>

        {/* Feedback Section */}
        <label>Customer Feedbacks:</label>
        {form.feedbacks.map((feedback, index) => (
          <div key={index} className="feedback-input">
            <input
              type="text"
              placeholder="Author"
              value={feedback.author}
              onChange={(e) => handleFeedbackChange(index, 'author', e.target.value)}
            />
            <input
              type="text"
              placeholder="Message"
              value={feedback.message}
              onChange={(e) => handleFeedbackChange(index, 'message', e.target.value)}
            />
            {form.feedbacks.length > 1 && (
              <button type="button" onClick={() => removeFeedbackField(index)} className="remove-feedback-btn">
                ✖
              </button>
            )}
          </div>
        ))}
        {form.feedbacks.length < 3 && (
          <button type="button" onClick={addFeedbackField} className="add-feedback-btn">
            + Add Feedback
          </button>
        )}

        <button type="submit" className="submit-store-btn" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default CreateStore;
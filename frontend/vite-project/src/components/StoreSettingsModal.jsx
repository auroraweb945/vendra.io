// src/components/StoreSettingsModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/modal.css';

const StoreSettingsModal = ({ onClose }) => {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    about: [''], // 🟢 Now array of offers instead of a single string
    logo_url: '',
    background_url: '',
    feedbacks: [{ author: '', message: '' }],
  });

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await axios.get('https://vendra-io.onrender.com/api/store', {
        headers: { Authorization: `Bearer ${token}` },
      });

      let aboutArray = [];
      try {
        // Try parsing existing about as JSON array
        aboutArray = Array.isArray(JSON.parse(res.data.about))
          ? JSON.parse(res.data.about)
          : [res.data.about || ''];
      } catch {
        // If it's a string, wrap it in an array
        aboutArray = res.data.about ? [res.data.about] : [''];
      }

      setFormData({
        name: res.data.name || '',
        slug: res.data.slug || '',
        description: res.data.description || '',
        about: aboutArray.slice(0, 3),
        logo_url: res.data.logo_url || '',
        background_url: res.data.background_url || '',
        feedbacks:
          Array.isArray(res.data.feedbacks) && res.data.feedbacks.length > 0
            ? res.data.feedbacks.slice(0, 3)
            : [{ author: '', message: '' }],
      });
    } catch (err) {
      setError('Failed to load store');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🟢 Handle offers
  const handleOfferChange = (index, value) => {
    const updatedOffers = [...formData.about];
    updatedOffers[index] = value;
    setFormData((prev) => ({ ...prev, about: updatedOffers }));
  };

  const addOfferField = () => {
    if (formData.about.length < 3) {
      setFormData((prev) => ({ ...prev, about: [...prev.about, ''] }));
    }
  };

  const removeOfferField = (index) => {
    const updated = [...formData.about];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, about: updated }));
  };

  // 🟢 Handle feedbacks
  const handleFeedbackChange = (index, field, value) => {
    const updatedFeedbacks = [...formData.feedbacks];
    updatedFeedbacks[index][field] = value;
    setFormData((prev) => ({ ...prev, feedbacks: updatedFeedbacks }));
  };

  const addFeedbackField = () => {
    if (formData.feedbacks.length < 3) {
      setFormData((prev) => ({
        ...prev,
        feedbacks: [...prev.feedbacks, { author: '', message: '' }],
      }));
    }
  };

  const removeFeedbackField = (index) => {
    const updated = [...formData.feedbacks];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, feedbacks: updated }));
  };

  // Upload handler
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

      setFormData((prev) => ({ ...prev, [fieldName]: res.data.url }));
      setMsg('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateStore = async () => {
    setMsg('');
    setError('');

    try {
      await axios.put(
        'https://vendra-io.onrender.com/api/store/update',
        {
          ...formData,
          about: JSON.stringify(formData.about.filter((offer) => offer.trim() !== '')),
          feedbacks: formData.feedbacks.filter((f) => f.author || f.message),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMsg('Store updated successfully!');
      fetchStore();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update store');
    }
  };

  if (loading) return <div className="modal">Loading store data...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🏪 Store Settings</h3>
        {msg && <p className="modal-message">{msg}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>Store Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} />
        <br/>

        <label>Store Slug:</label>
        <input name="slug" value={formData.slug} onChange={handleChange} />
        <br/>

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={100}
        />
        <small>{formData.description.length}/100 characters</small>
        <br/>

        {/* 🟢 Offers Section */}
        <label>Store Offers (up to 3):</label>
        {formData.about.map((offer, index) => (
          <div key={index} className="offer-input">
            <input
              type="text"
              placeholder="e.g., Free Delivery on Orders Above $50"
              value={offer}
              onChange={(e) => handleOfferChange(index, e.target.value)}
            />
            {formData.about.length > 1 && (
              <button
                type="button"
                onClick={() => removeOfferField(index)}
                className="remove-feedback-btn"
              >
                ✖
              </button>
            )}
          </div>
        ))}
        {formData.about.length < 3 && (
          <button type="button" onClick={addOfferField} className="add-feedback-btn">
            + Add Offer
          </button>
        )}
        <br/>

        {/* 🖼 Logo Upload */}
        <label>Logo:</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo_url')} />
        {formData.logo_url && (
          <img
            src={formData.logo_url}
            alt="Logo"
            style={{ width: '80px', marginTop: '10px', borderRadius: '8px' }}
          />
        )}
        <br/>

        {/* 🖼 Background Upload */}
        <label>Background Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'background_url')}
        />
        {formData.background_url && (
          <img
            src={formData.background_url}
            alt="Background"
            style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
          />
        )}
        <br/>

        {/* Feedbacks */}
        <label>Customer Feedbacks:</label>
        {formData.feedbacks.map((feedback, index) => (
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
            {formData.feedbacks.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeedbackField(index)}
                className="remove-feedback-btn"
              >
                ✖
              </button>
            )}
          </div>
        ))}
        {formData.feedbacks.length < 3 && (
          <button type="button" onClick={addFeedbackField} className="add-feedback-btn">
            + Add Feedback
          </button>
        )}
        <br/>

        <button className="save-btn" onClick={updateStore} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Update Store'}
        </button>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default StoreSettingsModal;
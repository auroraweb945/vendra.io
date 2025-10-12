// src/components/settings/ChangeNameModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/modal.css';

const ChangeNameModal = ({ onClose, onNameUpdated }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.put(
        'https://vendra-io.onrender.com/api/profile/name',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      onNameUpdated(); // parent component can refresh display name if needed
      setTimeout(onClose, 1500); // auto-close after success
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to update name';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Change Your Name</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="New name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="modal-submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
        {error && <p className="modal-error">{error}</p>}
        {message && <p className="modal-success">{message}</p>}
        <button className="modal-close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangeNameModal;

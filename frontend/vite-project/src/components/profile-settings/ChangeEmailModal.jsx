// src/components/settings/ChangeEmailModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/modal.css';

const ChangeEmailModal = ({ onClose, onEmailUpdated }) => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      await axios.put(
        'http://localhost:5000/api/profile/email',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg('✅ Email updated successfully');
      onEmailUpdated(); // Refresh profile
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.error || '❌ Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>📧 Change Email</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Email'}
          </button>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
        {msg && <p className="modal-msg">{msg}</p>}
      </div>
    </div>
  );
};

export default ChangeEmailModal;

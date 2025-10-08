// src/components/settings/ChangePasswordModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/modal.css';

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      await axios.put(
        'http://localhost:5000/api/profile/password',
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMsg('✅ Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.error || '❌ Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🔒 Change Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
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

export default ChangePasswordModal;

// src/components/SubscriptionModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/modal.css';

const SubscriptionModal = ({ onClose }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subscribe/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubscription(res.data);
      } catch (err) {
        console.error('Failed to load subscription info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>💳 Subscription Details</h3>

        {loading ? (
          <p>Loading...</p>
        ) : subscription ? (
          <>
            <p><strong>Plan:</strong> {subscription.plan || 'N/A'}</p>
            <p><strong>Price:</strong> ${subscription.price || 0}</p>
            <p><strong>Status:</strong> {subscription.status}</p>
            <p><strong>Expires At:</strong> 
              {subscription.expires_at
                ? new Date(subscription.expires_at).toLocaleDateString()
                : 'N/A'}
            </p>
          </>
        ) : (
          <p>No subscription found.</p>
        )}

        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SubscriptionModal;

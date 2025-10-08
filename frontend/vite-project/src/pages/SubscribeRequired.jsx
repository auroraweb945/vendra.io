// src/pages/SubscribeRequired.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/subscribe-required.css';

const SubscribeRequired = () => {
  const navigate = useNavigate();

  return (
    <div className="subscribe-required-container">
      <h2>🚫 Subscription Required</h2>
      <p>
        You need an active subscription to create a store.  
        Upgrade now to unlock all features 🚀
      </p>

      <div className="subscribe-required-buttons">
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
        <button className="subscribe-btn" onClick={() => navigate('/subscription-plans')}>
          💳 View Plans
        </button>
      </div>
    </div>
  );
};

export default SubscribeRequired;

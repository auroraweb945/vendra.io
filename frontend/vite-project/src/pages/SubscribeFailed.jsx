import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/subscribe-failed.css';

const SubscribeFailed = () => {
  const navigate = useNavigate();
  return (
    <div className="sub-failed-container">
      <div className="sub-failed-card">
        <div className="icon">❌</div>
        <h2>Payment Failed</h2>
        <p>Something went wrong while processing your subscription payment.</p>
        <div className="actions">
          <button className="try-again" onClick={() => navigate('/subscription-plans')}>Try Again</button>
          <button className="ghost" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default SubscribeFailed;

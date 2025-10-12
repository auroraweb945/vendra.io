import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/subscription-status.css';

const SubscriptionStatus = ({ showManageButton = true }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('https://vendra-io.onrender.com/api/subscribe/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data);
      } catch {
        setStatus({ status: 'inactive' });
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return <div className="substatus-card">Loading subscription…</div>;
  const s = status?.status || 'inactive';
  const isActive = s === 'active';
  const isExpired = s === 'expired';

  return (
    <div className="substatus-card">
      <div className="row">
        <span className={`pill ${isActive ? 'green' : isExpired ? 'red' : 'gray'}`}>
          {isActive ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
        </span>
        {status?.expires_at && (
          <span className="expires">Renews / Expires: {new Date(status.expires_at).toLocaleDateString()}</span>
        )}
      </div>
      {showManageButton && (
        <button className="manage-btn" onClick={() => navigate('/subscription-plans')}>
          Manage Subscription
        </button>
      )}
    </div>
  );
};

export default SubscriptionStatus;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/subscription-expired.css';

const SubscriptionExpired = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subscribe/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return <div className="expired-container">Loading…</div>;

  const expiredOn = status?.expires_at ? new Date(status.expires_at).toLocaleDateString() : null;

  const whatsappNumber = "96176036653";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20I%20want%20to%20renew%20my%20subscription%20on%20Vendra`;

  return (
    <div className="expired-container">
      <div className="expired-card">
        <div className="expired-icon">⚠️</div>
        <h2>Your subscription has expired</h2>
        {expiredOn && <p className="muted">Expired on {expiredOn}</p>}
        <p>You need an active subscription to access store features.</p>

        <div className="expired-actions">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="renew-btn">
            Contact to Renew
          </a>
          <button className="alt-btn" onClick={() => navigate('/subscription-plans')}>View Plan Details</button>
          <button className="alt-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpired;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/subscription-plans.css';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ status: 'inactive', expires_at: null });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('https://vendra-io.onrender.com/api/subscribe/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data);
      } catch {
        // ignore and show plan anyway
      }
    };
    fetchStatus();
  }, []);

  const isActive = status?.status === 'active';
  const isExpired = status?.status === 'expired';

  // Replace with your WhatsApp number (in international format, without +)
  const whatsappNumber = "96176036653";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20I%20want%20to%20activate%20my%20subscription%20on%20Vendra`;

  return (
    <div className="plans-container">
      <header className="plans-hero">
        <h1>Unlock Your Store</h1>
        <p>First month <strong>$5</strong>, then <strong>$10/month</strong>. Cancel anytime.</p>
      </header>

      {/* Status banner */}
      <div className="plans-status">
        {isActive && (
          <div className="badge active">
            ✅ Active — {status.expires_at ? `renews ${new Date(status.expires_at).toLocaleDateString()}` : 'renews next month'}
          </div>
        )}
        {isExpired && <div className="badge expired">⚠️ Your subscription expired. Contact us to renew.</div>}
        {!isActive && !isExpired && <div className="badge inactive">ℹ️ You're not subscribed yet.</div>}
      </div>

      <div className="plans-grid">
        <div className="plan-card">
          <div className="plan-head">
            <h2>Basic</h2>
            <p>Everything you need to run your storefront</p>
          </div>

          <div className="plan-price">
            <div className="price-line"><span className="big">$5</span> first month</div>
            <div className="price-line muted">then $10/mo</div>
          </div>

          <ul className="plan-features">
            <li>✅ Create and manage your store</li>
            <li>✅ Add up to 20 products</li>
            <li>✅ Orders & customers</li>
            <li>✅ Branded storefront page</li>
            <li>✅ Email support</li>
          </ul>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="subscribe-btn"
          >
            {isActive ? 'Contact to Manage' : 'Activate My Subscription'}
          </a>

          <p className="tiny-note">
            To subscribe, please contact us via WhatsApp and complete your payment through Whish Money. 
            We will manually activate your subscription.
          </p>
        </div>
      </div>

      <div className="plans-footer-actions">
        <button className="ghost-btn" onClick={() => navigate(-1)}>← Go Back</button>
        <button className="ghost-btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

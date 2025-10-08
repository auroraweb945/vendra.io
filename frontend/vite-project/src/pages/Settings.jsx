// src/pages/Settings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/settings.css';
import useAuthGuard from '../hooks/useAuthGuard';
import useSubscriptionGuard from '../hooks/useSubscriptionGuard';
import Sidebar from "../components/Sidebar";

import ChangeNameModal from '../components/profile-settings/ChangeNameModal';
import ChangeEmailModal from '../components/profile-settings/ChangeEmailModal';
import ChangePasswordModal from '../components/profile-settings/ChangePasswordModal';
import StoreSettingsModal from '../components/StoreSettingsModal';
import SubscriptionModal from '../components/SubscriptionSettingsModal';

const Settings = () => {
  const { checking: authChecking, user } = useAuthGuard();
  const { loading: subscriptionLoading } = useSubscriptionGuard();
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [showNameModal, setShowNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setMsg('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (authChecking) return <p>Checking authentication...</p>;
  if (subscriptionLoading) return <p>Checking subscription...</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-with-sidebar">
      <Sidebar />
      <div className="page-content">
        <div className="settings-container">
          <h2>Settings</h2>
          {msg && <p className="settings-message">{msg}</p>}

          {/* Profile Section */}
          <div className="settings-section">
            <h3>👤 Profile</h3>
            
            <div className="profile-info">
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
            </div>

            <div className="settings-row" onClick={() => setShowNameModal(true)}>
              <div className="settings-row-content">
                <span className="settings-row-icon">✏️</span>
                <div className="settings-row-text">
                  <div className="settings-row-title">Change Name</div>
                  <div className="settings-row-description">Update your display name</div>
                </div>
              </div>
              <span className="settings-row-arrow">→</span>
            </div>

            <div className="settings-row" onClick={() => setShowEmailModal(true)}>
              <div className="settings-row-content">
                <span className="settings-row-icon">📧</span>
                <div className="settings-row-text">
                  <div className="settings-row-title">Change Email</div>
                  <div className="settings-row-description">Update your email address</div>
                </div>
              </div>
              <span className="settings-row-arrow">→</span>
            </div>

            <div className="settings-row" onClick={() => setShowPasswordModal(true)}>
              <div className="settings-row-content">
                <span className="settings-row-icon">🔒</span>
                <div className="settings-row-text">
                  <div className="settings-row-title">Change Password</div>
                  <div className="settings-row-description">Update your account password</div>
                </div>
              </div>
              <span className="settings-row-arrow">→</span>
            </div>
          </div>

          {/* Store Section */}
          <div className="settings-section">
            <h3>🏪 Store</h3>
            <div className="settings-row" onClick={() => setShowStoreModal(true)}>
              <div className="settings-row-content">
                <span className="settings-row-icon">⚙️</span>
                <div className="settings-row-text">
                  <div className="settings-row-title">Store Settings</div>
                  <div className="settings-row-description">Manage your store preferences and details</div>
                </div>
              </div>
              <span className="settings-row-arrow">→</span>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="settings-section">
            <h3>💳 Subscription</h3>
            <div className="settings-row" onClick={() => setShowSubscriptionModal(true)}>
              <div className="settings-row-content">
                <span className="settings-row-icon">📋</span>
                <div className="settings-row-text">
                  <div className="settings-row-title">Subscription Info</div>
                  <div className="settings-row-description">View and manage your subscription plan</div>
                </div>
              </div>
              <span className="settings-row-arrow">→</span>
            </div>
          </div>

          {/* Modals */}
          {showNameModal && (
            <ChangeNameModal
              onClose={() => setShowNameModal(false)}
              onNameUpdated={fetchProfile}
            />
          )}
          {showEmailModal && (
            <ChangeEmailModal
              onClose={() => setShowEmailModal(false)}
              onEmailUpdated={fetchProfile}
            />
          )}
          {showPasswordModal && (
            <ChangePasswordModal
              onClose={() => setShowPasswordModal(false)}
            />
          )}
          {showStoreModal && (
            <StoreSettingsModal onClose={() => setShowStoreModal(false)} />
          )}
          {showSubscriptionModal && (
            <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
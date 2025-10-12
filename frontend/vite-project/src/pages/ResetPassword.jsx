// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthFormWrapper from '../components/AuthFormWrapper';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMsg('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('https://vendra-io.onrender.com/api/auth/reset-password', {
        token,
        newPassword,
      });
      setMsg(res.data.message);
      setTimeout(() => navigate('/login'), 2000); // Redirect after success
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <AuthFormWrapper title="Reset Your Password">
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        {msg && <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{msg}</p>}
      </form>
    </AuthFormWrapper>
  );
};

export default ResetPassword;

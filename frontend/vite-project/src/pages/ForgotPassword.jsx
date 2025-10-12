import { useState } from 'react';
import axios from 'axios';
import AuthFormWrapper from '../components/AuthFormWrapper';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://vendra-io.onrender.com/api/auth/forgot-password', { email });
      setMsg(`Reset link sent: ${res.data.resetLink}`);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <AuthFormWrapper title="Forgot Password">
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Link</button>
        {msg && <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{msg}</p>}
      </form>
    </AuthFormWrapper>
  );
};

export default ForgotPassword;

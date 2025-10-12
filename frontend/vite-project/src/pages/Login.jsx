import { useState } from 'react';
import axios from 'axios';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://vendra-io.onrender.com/api/auth/login', form);
      localStorage.setItem('token', res.data.token);

      // Fetch profile to check if user has a store
      const profileRes = await axios.get('https://vendra-io.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      if (profileRes.data.store) {
        // user already has a store → go to dashboard
        navigate('/dashboard');
      } else {
        // new user → go to create store
        navigate('/create-store');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    
    <AuthFormWrapper title="Login to Vendra">
    
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        {msg && <p style={{ color: 'gray', marginTop: '10px' }}>{msg}</p>}
        <div className="link">
          Forgot password? <Link to="/forgot-password">Reset it</Link><br />
          New here? <Link to="/signup">Create account</Link>
        </div>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;

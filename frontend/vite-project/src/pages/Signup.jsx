import { useState } from 'react';
import axios from 'axios';
import AuthFormWrapper from '../components/AuthFormWrapper';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      setMsg(res.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <AuthFormWrapper title="Create Account">
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        {msg && <p style={{ color: 'gray', marginTop: '10px' }}>{msg}</p>}
        <div className="link">Already have an account? <Link to="/login">Login</Link></div>
      </form>
    </AuthFormWrapper>
  );
};

export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const OwnerRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'owner',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register-owner', formData);
      setMessage(response.data.message);

      setTimeout(() => {
        navigate('/owner-login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-form">
          <img src="/Profitpluslogo.png" alt="Profit Plus Logo" className="logo" />
          <h2>Owner Registration</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <center><label htmlFor="username">Username</label></center>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <center><label htmlFor="email">Email</label></center>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <center><label htmlFor="password">Password</label></center>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <center>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </center>
          </form>
          <p className="login-link">
            <center>Already have an account? <Link to="/owner-login">Login as Owner</Link></center>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegister;
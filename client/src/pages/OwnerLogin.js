import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const OwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, role, username } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);

      if (role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        setError('Unauthorized role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container">
    <div className="login-container">
      <div className="login-form">
        <img src="/Profitpluslogo.png" alt="Profit Plus Logo" className="logo" />
        <h2>Owner Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><center>
            <label htmlFor="email">Email</label></center>
            <input 
              type="email" 
              id="email"
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group"><center>
            <label htmlFor="password">Password</label></center>
            <input 
              type="password" 
              id="password"
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <br></br>
          <center>
          <button type="submit" className="submit-btn">Login</button></center>
        </form>
        <p className="register-link"><center>
          Don't have an account? <Link to="/owner-register">Register as Owner</Link></center>
        </p>
      </div>
    </div>
    </div>
  );
};

export default OwnerLogin;
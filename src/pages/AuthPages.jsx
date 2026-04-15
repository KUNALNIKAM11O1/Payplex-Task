import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/users?email=${email}`);
      const users = response.data;
      if (users.length > 0) {
         if (users[0].password === password) {
             onSignIn(users[0]);
             navigate('/dashboard');
         } else {
             alert('Invalid password');
         }
      } else {
         alert('User not found. Please sign up or use admin@admin.com');
      }
    } catch (error) {
       console.error("Login failed", error);
       alert("An error occurred during login. Is JSON server running?");
    }
  };

  return (
    <div className="hero-section d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: 0 }}>
      <div className="search-card w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="text-center mb-4">
          <span className="navbar-brand-icon mx-auto mb-3" style={{ width: 48, height: 48, fontSize: '1.5rem' }}>🌍</span>
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Sign in to your Globetrotter account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="search-label mb-2">Email Address</label>
            <input 
              type="email" 
              className="form-control search-input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="search-label mb-2">Password</label>
            <input 
              type="password" 
              className="form-control search-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-search w-100 d-flex justify-content-center align-items-center mb-3">
            Login
          </button>
          
          <p className="text-center text-muted mb-0">
            Don't have an account? <Link to="/signup" className="text-primary text-decoration-none fw-bold">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export const SignUp = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      alert("Please fill all fields");
      return;
    }
    
    try {
        const existing = await axios.get(`${API_URL}/users?email=${email}`);
        if(existing.data.length > 0) {
            alert('Email already registered! Please login.');
            return;
        }

        const newUserResponse = await axios.post(`${API_URL}/users`, { name, email, password, role });
        onSignIn(newUserResponse.data);
        navigate('/dashboard');
    } catch (error) {
        console.error("Signup failed", error);
        alert("An error occurred during signup.");
    }
  };

  return (
    <div className="hero-section d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
      <div className="search-card w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted">Start booking your dream trips</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="search-label mb-2">Full Name</label>
            <input 
              type="text" 
              className="form-control search-input" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="search-label mb-2">Email Address</label>
            <input 
              type="email" 
              className="form-control search-input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="search-label mb-2">Password</label>
            <input 
              type="password" 
              className="form-control search-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="search-label mb-2">Select Your Goal</label>
            <select 
              className="form-select search-input" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ paddingLeft: '16px' }}
            >
              <option value="buyer">I want to book travels</option>
              <option value="admin">I am an Administrator</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-search w-100 d-flex justify-content-center align-items-center mb-3">
            Complete Sign Up
          </button>
          
          <p className="text-center text-muted mb-0">
            Already registered? <Link to="/signin" className="text-primary text-decoration-none fw-bold">Login Here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

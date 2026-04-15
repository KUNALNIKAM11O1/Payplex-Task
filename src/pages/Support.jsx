import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://payplex-task.onrender.com';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/support`, {
        ...formData,
        date: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setStatus('error');
    }
  };

  return (
    <div className="hero-section" style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '100px' }}>
      <div className="container">
        <div className="search-card mx-auto" style={{ maxWidth: '600px' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Contact Support</h2>
            <p className="text-muted">How can we help make your journey better?</p>
          </div>

          {status === 'success' && (
            <div className="alert alert-success bg-success bg-opacity-25 text-white border-0 mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              Your message has been received! Our team will get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="alert alert-danger bg-danger bg-opacity-25 text-white border-0 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Failed to send message. Please try again later.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="search-label mb-2">Full Name</label>
              <input 
                type="text" 
                className="form-control search-input" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-3">
              <label className="search-label mb-2">Email Address</label>
              <input 
                type="email" 
                className="form-control search-input" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="search-label mb-2">Subject</label>
              <select 
                className="form-select search-input" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={{ paddingLeft: '16px' }}
                required
              >
                <option value="">Select a topic...</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Payment Problem">Payment Problem</option>
                <option value="Refund Request">Refund Request</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="search-label mb-2">Message</label>
              <textarea 
                className="form-control search-input" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Please describe your issue in detail..."
                style={{ paddingLeft: '16px', borderRadius: '12px' }}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-search w-100 d-flex justify-content-center align-items-center mb-3">
              Submit Ticket <i className="bi bi-send ms-2"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;

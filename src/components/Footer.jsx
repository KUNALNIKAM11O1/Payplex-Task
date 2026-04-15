import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-section" id="footer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-4">
            <div className="footer-brand mb-2">🌍 Globetrotter</div>
            <p className="footer-desc">Your one-stop platform for booking flights, hotels, and buses across the globe.</p>
          </div>
          <div className="col-6 col-md-2">
            <div className="footer-heading">Company</div>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Press</a>
          </div>
          <div className="col-6 col-md-2">
            <div className="footer-heading">Support</div>
            <a href="#" className="footer-link">Help Center</a>
            <a href="#" className="footer-link">Safety</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
          <div className="col-12 col-md-4">
            <div className="footer-heading">Stay Updated</div>
            <div className="input-group">
              <input type="email" className="form-control search-input" placeholder="Your email" style={{ paddingLeft: '16px' }} />
              <button className="btn btn-search" style={{ borderRadius: '0 12px 12px 0' }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 Globetrotter. All rights reserved. Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

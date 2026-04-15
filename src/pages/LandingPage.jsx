import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <section className="hero-section text-center" id="hero">
        <div className="container">
          <div className="mb-5">
            <h1 className="hero-title mb-3 fade-in-up">
              Discover Your Next <span className="hero-highlight">Adventure</span>
            </h1>
            <p className="hero-subtitle mx-auto fade-in-up delay-1">
              Explore the world with seamless flights, premium hotels, and comfortable buses — all at your fingertips.
            </p>
          </div>
          
          <div className="fade-in-up delay-2 mt-4">
            <Link to="/signup" className="btn btn-search me-3 px-5 py-3 fs-5 border-0">
               Get Started Now <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="stats-bar mt-5 mx-auto fade-in-up delay-3" style={{ maxWidth: '700px' }}>
            <div className="row text-center">
              <div className="col-4">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Destinations</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-item">
                  <div className="stat-number">100K+</div>
                  <div className="stat-label">Happy Travelers</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-item">
                  <div className="stat-number">4.9</div>
                  <div className="stat-label">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="why-us">
        <div className="container">
          <h2 className="section-title text-center mb-5">Why Choose Globetrotter?</h2>
          <div className="row g-4">
            {[
              { icon: 'bi-shield-check', title: 'Secure Booking', desc: 'Your payments and personal data are always protected with bank-grade encryption.' },
              { icon: 'bi-lightning-charge', title: 'Instant Confirmation', desc: 'Get your booking confirmed in seconds. No waiting, no hassle.' },
              { icon: 'bi-headset', title: '24/7 Support', desc: 'Our travel experts are available around the clock to help you with anything.' },
            ].map((feature, i) => (
              <div className={`col-12 col-md-4 fade-in-up delay-${i + 1}`} key={i}>
                <div className="search-card text-center h-100 p-4">
                  <i className={`bi ${feature.icon}`} style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                  <h5 className="mt-3 mb-2 fw-bold">{feature.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;

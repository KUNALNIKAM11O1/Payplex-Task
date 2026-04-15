import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, handleSignOut }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top" id="main-nav">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="navbar-brand-icon">🌍</span>
          <span className="navbar-brand-text">Globetrotter</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to={user ? "/dashboard" : "/"}>Explore</Link>
            </li>
            <li className="nav-item"><Link className="nav-link" to="/deals">Deals</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/support">Support</Link></li>
            {user?.role === 'admin' && (
              <li className="nav-item"><Link className="nav-link" to="/admin" style={{ color: 'var(--accent)' }}>Admin Dashboard</Link></li>
            )}
          </ul>
          {user ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white d-none d-lg-block">Hello, {user.name || user.email.split('@')[0]}</span>
              <button className="btn btn-outline-light" onClick={handleSignOut}>Logout</button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/signin" className="btn btn-outline-light">Login</Link>
              <Link to="/signup" className="btn btn-search">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

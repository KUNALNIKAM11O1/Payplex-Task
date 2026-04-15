import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Admin from './pages/Admin.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { SignIn, SignUp } from './pages/AuthPages.jsx';
import Support from './pages/Support.jsx';
import Deals from './pages/Deals.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  
  const handleSignIn = (userData) => {
     setUser(userData);
  };

  const handleSignOut = () => setUser(null);

  return (
    <>
      <Header user={user} handleSignOut={handleSignOut} />      <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/signup" element={<SignUp onSignIn={handleSignIn} />} />
          <Route path="/support" element={<Support />} />
          <Route path="/deals" element={<Deals user={user} />} />
          
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/signin" />} 
          />
          
          <Route 
            path="/admin/*" 
            element={user?.role === 'admin' ? <Admin /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbaar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state while we check authentication
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Send request to the API to validate the token
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/authenticate`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });

          if (response.ok) {
            // Token is valid, decode the response (user data)
            const decoded = await response.json();
            localStorage.setItem('username', decoded.username); // Save decoded data to localStorage
            localStorage.setItem('token', token); // Save token to localStorage
            setIsAuthenticated(true); // Set the user as authenticated
          } else {
            // If the token is invalid or expired, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('decoded');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false); // No token in localStorage, user is not authenticated
      }

      setLoading(false); // Done with loading state
    };

    checkAuthentication();
  }, []);

  const handleSignOut = () => {
    // Clear token and decoded data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('decoded');
    setIsAuthenticated(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }
  const username = localStorage.getItem('username');
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        StoryMosaic
      </Link>

      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {mobileMenuOpen && (
          <button className="close-menu" onClick={closeMobileMenu}>
            ✕
          </button>
        )}
        
        <ul className="navbar-links">
          <li>
            <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="navbar-link" onClick={closeMobileMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/popular" className="navbar-link" onClick={closeMobileMenu}>
              Popular Stories
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to={`/user/${username}`} className="navbar-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>
        
        {!isAuthenticated && (
          <div className="navbar-buttons">
            <Link to="/authentication" className="signin-button" onClick={closeMobileMenu}>
              Sign In
            </Link>
            <Link to="/authentication" className="signup-button" onClick={closeMobileMenu}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
      {mobileMenuOpen && (
        <div className={`menu-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
};

export default Navbaar;
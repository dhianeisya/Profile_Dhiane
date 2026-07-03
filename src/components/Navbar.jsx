import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');

  useEffect(() => {
    const checkLogin = () => {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  useEffect(() => {
    setLoggedIn(localStorage.getItem('loggedIn') === 'true');
  }, [location]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav>
      <div className="nav-logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
        Dhiane Profile
      </div>
      <div className="nav-links">
        <span onClick={() => handleNavClick('about')} style={{ cursor: 'pointer', marginRight: '15px' }}>About</span>
        <span onClick={() => handleNavClick('articles')} style={{ cursor: 'pointer', marginRight: '15px' }}>Articles</span>
        <span onClick={() => handleNavClick('skills')} style={{ cursor: 'pointer', marginRight: '15px' }}>Skills</span>
        <span onClick={() => handleNavClick('contact')} style={{ cursor: 'pointer', marginRight: '15px' }}>Contact</span>
        {loggedIn ? (
          <Link to="/dashboard" id="cms-link" style={{ marginRight: '15px' }}>CMS</Link>
        ) : (
          <Link to="/login" id="cms-link" style={{ marginRight: '15px' }}>Login</Link>
        )}
        <button id="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

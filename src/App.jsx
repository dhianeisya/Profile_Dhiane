import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';
import './styles/styles.css';

export default function App() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/login' || location.pathname === '/dashboard';

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/artikel/:id" element={<ArticleDetail />} />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

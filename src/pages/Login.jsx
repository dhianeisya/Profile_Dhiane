import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import Toast from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username tidak boleh kosong.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password tidak boleh kosong.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const data = await login(username, password);
      if (data.success) {
        setSuccess(true);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', data.user.username);
        setToast({ message: 'Login berhasil! Mengalihkan...', type: 'success' });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setToast({ message: data.message || 'Username atau password salah.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal menghubungkan ke server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>Masuk</h1>
            <p>Selamat datang kembali ke profile saya</p>
          </div>

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors({ ...errors, username: '' });
                }}
                className={errors.username ? 'error' : ''}
                disabled={loading || success}
              />
              {errors.username && <div className="error-message" style={{ display: 'block' }}>{errors.username}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: '' });
                }}
                className={errors.password ? 'error' : ''}
                disabled={loading || success}
              />
              {errors.password && <div className="error-message" style={{ display: 'block' }}>{errors.password}</div>}
            </div>

            <button type="submit" className="btn-login" disabled={loading || success}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            {success && (
              <div className="success-message" style={{ display: 'block' }}>
                Login berhasil! Anda akan dialihkan...
              </div>
            )}
          </form>

          <div className="back-link">
            <Link to="/">← Kembali ke profile</Link>
          </div>
        </div>
      </div>
      
      {toast.message && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: '', type: '' })} 
        />
      )}
    </div>
  );
}

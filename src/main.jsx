import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('SW: Registered successfully!', reg);
        
        // Setup Push Notifications Permission
        if ('Notification' in window) {
          Notification.requestPermission().then(permission => {
            console.log('Push: Notification permission status:', permission);
          });
        }
      })
      .catch(err => console.log('SW: Registration failed: ', err));
  });
}

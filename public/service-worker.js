const CACHE_NAME = 'dhiane-profile-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/foto.jpeg',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Offline Caching)
self.addEventListener('fetch', event => {
  // Direct fetch for API calls or non-GET requests
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  const isHtml = event.request.url.endsWith('/') || 
                 event.request.url.endsWith('/index.html') || 
                 event.request.mode === 'navigate';

  if (isHtml) {
    // Network First Strategy for HTML/Navigation to prevent cached index.html from serving deleted old assets
    event.respondWith(
      fetch(event.request)
        .then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            if (event.request.url.startsWith('http')) {
              cache.put(event.request.url, fetchRes.clone());
            }
            return fetchRes;
          });
        })
        .catch(() => {
          return caches.match('/index.html');
        })
    );
  } else {
    // Cache First Strategy for static assets (images, fonts, bundles with hashes)
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).then(fetchRes => {
            return caches.open(CACHE_NAME).then(cache => {
              if (event.request.url.startsWith('http')) {
                cache.put(event.request.url, fetchRes.clone());
              }
              return fetchRes;
            });
          });
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
    );
  }
});


// Push Notification Event
self.addEventListener('push', event => {
  let data = { title: 'Pemberitahuan Baru', body: 'Ada pembaruan menarik di website saya!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Pemberitahuan Baru', body: event.data.text() };
    }
  }
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if target window is already open and focus it
      for (let client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

const CACHE_NAME = 'bookmarkly-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method === 'POST' && requestUrl.pathname === '/dashboard/add') {
    event.respondWith(handleShareTarget(event));
    return;
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

async function handleShareTarget(event) {
  try {
    const formData = await event.request.formData();
    const targetUrl = new URL('/dashboard/add', self.location.origin);
    ['title', 'text', 'url'].forEach((key) => {
      const value = formData.get(key);
      if (value) {
        targetUrl.searchParams.set(key, value.toString());
      }
    });

    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (clientsList.length > 0) {
      clientsList[0].navigate(targetUrl.href);
      clientsList[0].focus();
    } else {
      await self.clients.openWindow(targetUrl.href);
    }

    return Response.redirect(targetUrl.href, 303);
  } catch (error) {
    console.error('Failed to handle share target:', error);
    return Response.redirect('/dashboard/add', 303);
  }
}

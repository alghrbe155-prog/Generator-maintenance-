// sw.js - نسخة مبسطة ومضمونة 100%
const CACHE_NAME = 'generator-system-v2';
const ASSETS = [
  '/Generator-maintenance-/index.html',
  '/Generator-maintenance-/manifest.json',
  '/Generator-maintenance-/sw.js',
  '/Generator-maintenance-/icon-192.png',
  '/Generator-maintenance-/icon-512.png'
];

// تثبيت السيرفر - نخزن فقط الملفات المحلية (بدون مكتبات خارجية)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ تم تخزين الملفات الأساسية');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.warn('⚠️ فشل التخزين:', err))
  );
  self.skipWaiting();
});

// تفعيل السيرفر وتنظيف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// استراتيجية ذكية: نعرض من الكاش أولاً، ثم نطلب من الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // من الكاش
        }
        return fetch(event.request).catch(() => {
          return new Response('⚠️ غير متصل بالإنترنت', { status: 503 });
        });
      })
  );
});
// sw.js - سيرفر خدمة نظام المهندس إبراهيم الغربي
const CACHE_NAME = 'generator-system-v1';
const ASSETS = [
  'y.html',
  'manifest.json',
  'sw.js',
  // روابط المكتبات الخارجية (لتخزينها مؤقتاً)
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// تثبيت السيرفر وتحميل الملفات للذاكرة المؤقتة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح الكاش وتخزين الملفات');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.warn('فشل تخزين بعض الملفات:', err))
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

// استراتيجية: "Cache First" ثم طلب الشبكة (للملفات الثابتة)
// و "Network First" لقاعدة البيانات (لأنها تتغير)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // تجاهل طلبات Firebase (لا نخزنها مؤقتاً لأنها تحتاج اتصال)
  if (url.hostname.includes('firebaseio.com') || 
      url.hostname.includes('googleapis.com') && !url.pathname.includes('css')) {
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('غير متصل بقاعدة البيانات', { status: 503 });
    }));
    return;
  }

  // استراتيجية Cache First للملفات الثابتة (HTML, CSS, JS, Fonts)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          // تخزين نسخة جديدة من الملفات التي تم تحميلها حديثاً
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(() => {
          // إذا كان الملف غير موجود في الكاش وغير متاح على الشبكة
          return new Response('⚠️ لا يوجد اتصال بالإنترنت وهذه الصفحة غير مخزنة', { status: 404 });
        });
      })
  );
});

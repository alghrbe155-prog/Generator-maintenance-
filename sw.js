// sw.js - نسخة خفيفة وسريعة (لا تخزن ملفات ثقيلة عند التحميل)
const CACHE_NAME = 'generator-system-v9';
const ASSETS = [
    'index.html',
    'manifest.json',
    'sw.js',
    'icon-192.png',
    'icon-512.png'
    // لاحظ: حذفت Firebase و Chart.js من التخزين المؤقت
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// استراتيجية: شبكة أولاً (Network First) للملفات الديناميكية، وكاش للملفات الثابتة فقط
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Firebase و Google Fonts و Chart.js: نمررها مباشرة للشبكة بدون تخزين
    if (url.hostname.includes('gstatic') || 
        url.hostname.includes('googleapis') || 
        url.hostname.includes('firebaseio') ||
        url.hostname.includes('cdn.jsdelivr')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // للملفات المحلية: نبحث في الكاش أولاً، ثم الشبكة
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});
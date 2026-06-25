// ============================================================
//  Service Worker قوي - يخزن كل الملفات محلياً
// ============================================================
const CACHE_NAME = 'generator-system-v10';
const ASSETS = [
    '/Generator-maintenance-/',
    '/Generator-maintenance-/index.html',
    '/Generator-maintenance-/manifest.json',
    '/Generator-maintenance-/sw.js',
    '/Generator-maintenance-/icon-192.png',
    '/Generator-maintenance-/icon-512.png',
    '/Generator-maintenance-/generator_reports_page.html',
    '/Generator-maintenance-/oil_reports_page.html',
    '/Generator-maintenance-/oil_status.html',
    '/Generator-maintenance-/sites_data.js',
    // المكتبات الخارجية (نخزنها أيضاً)
    'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// تثبيت الـ Service Worker وتخزين كل الملفات
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('📦 جاري تخزين جميع الملفات...');
            return cache.addAll(ASSETS);
        })
        .then(() => self.skipWaiting())
    );
});

// تفعيل والتحكم بالصفحات فوراً
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// استراتيجية: Cache First (من الكاش أولاً) ثم الشبكة
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                // نعيد الملف من الكاش فوراً (بدون انتظار الشبكة)
                return response;
            }
            // إذا لم يكن في الكاش، نحاول الشبكة
            return fetch(event.request).then(response => {
                // نخزن النسخة الجديدة في الكاش
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(() => {
                // إذا كان الملف غير موجود وغير متصل
                return new Response('⚠️ هذا الملف غير مخزن محلياً', { status: 404 });
            });
        })
    );
});
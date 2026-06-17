// site_status.js - عرض حالة الزيت لكل موقع (آخر تغيير، الموعد القادم، المتبقي من الساعات)

// تأكد من وجود Firebase SDK
if (typeof firebase === 'undefined') {
    console.error("Firebase SDK not loaded. Please include Firebase scripts before this file.");
}

// رابط قاعدة البيانات (نفس الـ config المستخدم في y.html)
const firebaseConfig_status = {
    apiKey: "AIzaSyBwqIx4ZfEHKvYzLwnw5npl2My3YGO6zOQ",
    authDomain: "generators-cf3f8.firebaseapp.com",
    projectId: "generators-cf3f8",
    storageBucket: "generators-cf3f8.firebasestorage.app",
    messagingSenderId: "1069488150812",
    appId: "1:1069488150812:web:a3481e4fdf6ac0b68942d9",
    measurementId: "G-ZKK2LP22MN",
    databaseURL: "https://generators-cf3f8-default-rtdb.firebaseio.com"
};

// تهيئة Firebase إذا لم تكن مهيأة مسبقاً
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig_status);
}
const database_status = firebase.database();

// دوال مساعدة
function daysRemaining(nextDate) {
    if (!nextDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(nextDate);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function calcNextDate(currentHours, avgDaily, recordDate) {
    if (!avgDaily || avgDaily <= 0) return null;
    const daysNeeded = Math.ceil(300 / avgDaily);
    const target = new Date(recordDate);
    target.setDate(target.getDate() + daysNeeded);
    return target.toISOString().split('T')[0];
}

// دالة عرض البيانات في عنصر HTML محدد
async function displayOilStatus(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id "${containerId}" not found.`);
        return;
    }

    container.innerHTML = '<div style="text-align:center; padding:20px;">⏳ جاري تحميل بيانات الزيت...</div>';

    try {
        const snapshot = await database_status.ref('oils').once('value');
        const oilsData = snapshot.val();
        if (!oilsData) {
            container.innerHTML = '<div style="text-align:center; padding:20px;">⚠️ لا توجد سجلات زيت بعد</div>';
            return;
        }

        // تحويل إلى مصفوفة وترتيب حسب التاريخ (أحدث أولاً)
        const oilsArray = Object.values(oilsData);
        // تجميع آخر تسجيل لكل موقع
        const latestOilPerSite = new Map();
        oilsArray.forEach(oil => {
            const site = oil.site;
            if (!latestOilPerSite.has(site) || new Date(oil.date) > new Date(latestOilPerSite.get(site).date)) {
                latestOilPerSite.set(site, oil);
            }
        });

        // تحويل الخريطة إلى مصفوفة وترتيب حسب اسم الموقع
        const sitesList = Array.from(latestOilPerSite.values()).sort((a, b) => a.site.localeCompare(b.site));

        if (sitesList.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:20px;">✨ لا توجد مواقع بعد</div>';
            return;
        }

        // إنشاء الجدول
        let html = `
            <style>
                .oil-status-table {
                    width: 100%;
                    border-collapse: collapse;
                    direction: rtl;
                    font-family: 'Cairo', sans-serif;
                }
                .oil-status-table th, .oil-status-table td {
                    border: 1px solid #334155;
                    padding: 12px 8px;
                    text-align: center;
                    vertical-align: middle;
                }
                .oil-status-table th {
                    background: #1e293b;
                    color: #00c6ff;
                    font-weight: 800;
                }
                .oil-status-table td {
                    background: #0f172a;
                    color: #f8fafc;
                }
                .status-critical { background: #7f1a1a; color: #fecaca; font-weight: bold; }
                .status-warning { background: #78350f; color: #fde68a; font-weight: bold; }
                .status-good { background: #064e3b; color: #a7f3d0; font-weight: bold; }
                @media (max-width: 700px) {
                    .oil-status-table th, .oil-status-table td { padding: 8px 4px; font-size: 12px; }
                }
            </style>
            <table class="oil-status-table" dir="rtl">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>اسم الموقع</th>
                        <th>آخر تغيير زيت</th>
                        <th>العداد عند التغيير</th>
                        <th>الموعد القادم</th>
                        <th>المتبقي (ساعة)</th>
                        <th>الحالة</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sitesList.forEach((oil, idx) => {
            const lastHours = oil.current || 0;
            const avgDaily = oil.avgDailyHours || 16; // افتراضي 16 ساعة إذا لم يكن موجوداً
            const nextDate = oil.nextDate || calcNextDate(lastHours, avgDaily, new Date(oil.date));
            let remainingHours = null;
            let statusClass = '';
            let statusText = '';

            if (nextDate && avgDaily) {
                // حساب الساعات المتبقية: (عدد الأيام المتبقية * متوسط التشغيل)
                const daysLeft = daysRemaining(nextDate);
                if (daysLeft !== null && daysLeft >= 0) {
                    remainingHours = Math.round(daysLeft * avgDaily);
                    if (remainingHours <= 0) {
                        statusClass = 'status-critical';
                        statusText = '⚠️ تجاوز';
                    } else if (remainingHours <= 50) {
                        statusClass = 'status-critical';
                        statusText = '🔴 حرج';
                    } else if (remainingHours <= 100) {
                        statusClass = 'status-warning';
                        statusText = '🟠 قريب';
                    } else {
                        statusClass = 'status-good';
                        statusText = '🟢 جيد';
                    }
                } else {
                    remainingHours = '—';
                    statusText = '—';
                }
            } else {
                remainingHours = '—';
                statusText = '—';
            }

            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td style="font-weight:800;">${oil.site}</td>
                    <td>${oil.date || '—'}</td>
                    <td>${lastHours} H</td>
                    <td>${nextDate || '—'}</td>
                    <td>${remainingHours !== null && remainingHours !== '—' ? remainingHours + ' ساعة' : '—'}</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div style="margin-top:12px; font-size:12px; color:#94a3b8; text-align:center;">
                * المتبقي من الساعات يحسب بناءً على متوسط التشغيل اليومي (آخر تسجيل أو 16 ساعة افتراضياً)
            </div>
        `;
        container.innerHTML = html;
    } catch (error) {
        console.error(error);
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#ef4444;">❌ فشل تحميل البيانات</div>';
    }
}

// دالة لتحديث البيانات كل دقيقة (اختياري)
function startOilStatusAutoRefresh(containerId, intervalSeconds = 60) {
    displayOilStatus(containerId);
    setInterval(() => {
        displayOilStatus(containerId);
    }, intervalSeconds * 1000);
}
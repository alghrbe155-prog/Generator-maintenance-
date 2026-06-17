// ==================== extras.js ====================
// إضافة حقلي المولدين لموقع "بالمس فلج (النخيله)" فقط
// يعمل مع ملف y.html الحالي دون تعديله

(function() {
    // انتظار تحميل الصفحة
    function waitForElement(selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(() => waitForElement(selector, callback), 200);
        }
    }

    // الموقع المستهدف
    const TARGET_SITE = "بالمس فلج (النخيله)";

    // ========== 1. تعديل صفحة زيارة المولد ==========
    function fixGeneratorPage() {
        let siteInput = document.getElementById("g_site");
        if (!siteInput) return;
        
        let site = siteInput.value.trim();
        let isDual = (site === TARGET_SITE);
        
        // إخفاء قائمة رقم المولد
        let unitContainer = document.getElementById("g_unit_container");
        if (unitContainer) unitContainer.style.display = isDual ? "none" : "block";
        
        // إخفاء الحقول العادية
        let oldHours = document.getElementById("g_hours");
        let oldDiesel = document.getElementById("g_diesel");
        let oldNote = document.getElementById("g_note");
        if (oldHours) oldHours.style.display = isDual ? "none" : "block";
        if (oldDiesel) oldDiesel.style.display = isDual ? "none" : "block";
        if (oldNote) oldNote.style.display = isDual ? "none" : "block";
        
        // إنشاء حقول المولدين إذا لم تكن موجودة
        if (isDual && !document.getElementById("g_dual_panel")) {
            let card = document.querySelector("#generator .card");
            if (card) {
                let saveBtn = card.querySelector(".btn-save");
                let panel = document.createElement("div");
                panel.id = "g_dual_panel";
                panel.style.marginTop = "15px";
                panel.innerHTML = `
                    <div style="background:#0f172a; border-radius:20px; padding:15px; margin-bottom:15px; border:1px solid #f59e0b;">
                        <div style="font-weight:800; color:#f59e0b;">🔹 المولد الأول</div>
                        <input type="number" id="g_h1" placeholder="عداد الساعات - مولد 1" style="margin:8px 0; width:100%;">
                        <input type="number" id="g_d1" placeholder="ديزل (CM) - مولد 1" style="margin:8px 0; width:100%;">
                        <textarea id="g_n1" rows="2" placeholder="ملاحظات - مولد 1" style="width:100%;"></textarea>
                    </div>
                    <div style="background:#0f172a; border-radius:20px; padding:15px; margin-bottom:15px; border:1px solid #f59e0b;">
                        <div style="font-weight:800; color:#f59e0b;">🔸 المولد الثاني</div>
                        <input type="number" id="g_h2" placeholder="عداد الساعات - مولد 2" style="margin:8px 0; width:100%;">
                        <input type="number" id="g_d2" placeholder="ديزل (CM) - مولد 2" style="margin:8px 0; width:100%;">
                        <textarea id="g_n2" rows="2" placeholder="ملاحظات - مولد 2" style="width:100%;"></textarea>
                    </div>
                `;
                card.insertBefore(panel, saveBtn);
            }
        }
        let panel = document.getElementById("g_dual_panel");
        if (panel) panel.style.display = isDual ? "block" : "none";
    }

    // ========== 2. تعديل صفحة صيانة الزيت ==========
    function fixOilPage() {
        let siteInput = document.getElementById("o_site");
        if (!siteInput) return;
        
        let site = siteInput.value.trim();
        let isDual = (site === TARGET_SITE);
        
        let unitContainer = document.getElementById("o_unit_container");
        if (unitContainer) unitContainer.style.display = isDual ? "none" : "block";
        
        let oldCurr = document.getElementById("o_current");
        let oldDiesel = document.getElementById("o_diesel");
        let oldAvg = document.getElementById("o_avgDaily");
        let oldNote = document.getElementById("o_note");
        let oldFilters = document.querySelector("#oil .card > div:last-child");
        if (oldCurr) oldCurr.style.display = isDual ? "none" : "block";
        if (oldDiesel) oldDiesel.style.display = isDual ? "none" : "block";
        if (oldAvg) oldAvg.style.display = isDual ? "none" : "block";
        if (oldNote) oldNote.style.display = isDual ? "none" : "block";
        if (oldFilters) oldFilters.style.display = isDual ? "none" : "block";
        
        if (isDual && !document.getElementById("o_dual_panel")) {
            let card = document.querySelector("#oil .card");
            if (card) {
                let saveBtn = card.querySelector(".btn-save");
                let panel = document.createElement("div");
                panel.id = "o_dual_panel";
                panel.innerHTML = `
                    <div style="background:#0f172a; border-radius:20px; padding:15px; margin-bottom:15px; border:1px solid #f59e0b;">
                        <div style="font-weight:800; color:#f59e0b;">🔹 المولد الأول</div>
                        <input type="number" id="o_c1" placeholder="العداد الحالي - مولد 1" style="margin:8px 0; width:100%;">
                        <input type="number" id="o_dz1" placeholder="ديزل (CM) - مولد 1" style="margin:8px 0; width:100%;">
                        <input type="number" id="o_avg1" placeholder="متوسط التشغيل - مولد 1" step="0.5" style="margin:8px 0; width:100%;">
                        <textarea id="o_n1" rows="2" placeholder="ملاحظات - مولد 1" style="width:100%;"></textarea>
                        <div style="margin-top:10px;"><label>الفلاتر:</label> 
                            <label><input type="checkbox" id="f_oil1"> زيت</label>
                            <label><input type="checkbox" id="f_diesel1"> ديزل</label>
                            <label><input type="checkbox" id="f_air1"> هواء</label>
                        </div>
                    </div>
                    <div style="background:#0f172a; border-radius:20px; padding:15px; margin-bottom:15px; border:1px solid #f59e0b;">
                        <div style="font-weight:800; color:#f59e0b;">🔸 المولد الثاني</div>
                        <input type="number" id="o_c2" placeholder="العداد الحالي - مولد 2" style="margin:8px 0; width:100%;">
                        <input type="number" id="o_dz2" placeholder="ديزل (CM) - مولد 2" style="margin:8px 0; width:100%;">
                        <input type="number" id="o_avg2" placeholder="متوسط التشغيل - مولد 2" step="0.5" style="margin:8px 0; width:100%;">
                        <textarea id="o_n2" rows="2" placeholder="ملاحظات - مولد 2" style="width:100%;"></textarea>
                        <div style="margin-top:10px;"><label>الفلاتر:</label>
                            <label><input type="checkbox" id="f_oil2"> زيت</label>
                            <label><input type="checkbox" id="f_diesel2"> ديزل</label>
                            <label><input type="checkbox" id="f_air2"> هواء</label>
                        </div>
                    </div>
                `;
                card.insertBefore(panel, saveBtn);
            }
        }
        let panel = document.getElementById("o_dual_panel");
        if (panel) panel.style.display = isDual ? "block" : "none";
    }

    // ========== 3. استبدال دوال الحفظ ==========
    // حفظ الزيارة
    let originalSaveGen = window.saveGenerator;
    if (originalSaveGen) {
        window.saveGenerator = function() {
            let site = document.getElementById("g_site").value.trim();
            let isDual = (site === TARGET_SITE);
            
            if (!isDual) {
                originalSaveGen();
                return;
            }
            
            // الحالة المزدوجة
            let date = document.getElementById("g_date").value || new Date().toISOString().split('T')[0];
            let userName = localStorage.getItem("loggedUser") || "مستخدم";
            let userPhone = localStorage.getItem("loggedUserPhone") || "";
            
            let h1 = parseFloat(document.getElementById("g_h1")?.value);
            let d1 = parseFloat(document.getElementById("g_d1")?.value);
            let n1 = document.getElementById("g_n1")?.value || "";
            let h2 = parseFloat(document.getElementById("g_h2")?.value);
            let d2 = parseFloat(document.getElementById("g_d2")?.value);
            let n2 = document.getElementById("g_n2")?.value || "";
            
            let saved = 0;
            if (!isNaN(h1)) {
                window.generators.push({
                    id: window.generateId(),
                    recordedBy: userName,
                    recordedByPhone: userPhone,
                    date: date,
                    site: `${site} - مولد 1`,
                    hours: h1,
                    diesel: isNaN(d1) ? 0 : d1,
                    note: n1
                });
                saved++;
            }
            if (!isNaN(h2)) {
                window.generators.push({
                    id: window.generateId(),
                    recordedBy: userName,
                    recordedByPhone: userPhone,
                    date: date,
                    site: `${site} - مولد 2`,
                    hours: h2,
                    diesel: isNaN(d2) ? 0 : d2,
                    note: n2
                });
                saved++;
            }
            if (saved === 0) {
                if (typeof showToast === 'function') showToast("⚠️ أدخل بيانات مولد واحد على الأقل", "error");
                else alert("أدخل بيانات مولد واحد على الأقل");
                return;
            }
            if (typeof pushToFirebase === 'function') pushToFirebase();
            if (typeof saveToLocal === 'function') saveToLocal();
            if (typeof playSave === 'function') playSave();
            if (typeof showToast === 'function') showToast("✅ تم حفظ زيارة المولدين");
            
            // مسح الحقول المزدوجة
            document.getElementById("g_h1").value = "";
            document.getElementById("g_d1").value = "";
            document.getElementById("g_n1").value = "";
            document.getElementById("g_h2").value = "";
            document.getElementById("g_d2").value = "";
            document.getElementById("g_n2").value = "";
            
            if (typeof resetGeneratorForm === 'function') resetGeneratorForm();
            if (typeof go === 'function') go('records');
        };
    }

    // حفظ صيانة الزيت
    let originalSaveOil = window.saveOil;
    if (originalSaveOil) {
        window.saveOil = function() {
            let site = document.getElementById("o_site").value.trim();
            let isDual = (site === TARGET_SITE);
            
            if (!isDual) {
                originalSaveOil();
                return;
            }
            
            let recordDate = document.getElementById("o_date").value ? new Date(document.getElementById("o_date").value) : new Date();
            let dateStr = recordDate.toISOString().split('T')[0];
            let userName = localStorage.getItem("loggedUser") || "مستخدم";
            let userPhone = localStorage.getItem("loggedUserPhone") || "";
            
            function calcNext(cur, avg, rec) {
                if (!avg || avg <= 0) return null;
                let days = Math.ceil(300 / avg);
                let target = new Date(rec);
                target.setDate(target.getDate() + days);
                return target.toISOString().split('T')[0];
            }
            
            let c1 = parseFloat(document.getElementById("o_c1")?.value);
            let dz1 = parseFloat(document.getElementById("o_dz1")?.value);
            let avg1 = document.getElementById("o_avg1")?.value;
            let avgNum1 = avg1 ? parseFloat(avg1) : 16;
            let n1 = document.getElementById("o_n1")?.value || "";
            let f1 = {
                oil: document.getElementById("f_oil1")?.checked || false,
                diesel: document.getElementById("f_diesel1")?.checked || false,
                air: document.getElementById("f_air1")?.checked || false
            };
            
            let c2 = parseFloat(document.getElementById("o_c2")?.value);
            let dz2 = parseFloat(document.getElementById("o_dz2")?.value);
            let avg2 = document.getElementById("o_avg2")?.value;
            let avgNum2 = avg2 ? parseFloat(avg2) : 16;
            let n2 = document.getElementById("o_n2")?.value || "";
            let f2 = {
                oil: document.getElementById("f_oil2")?.checked || false,
                diesel: document.getElementById("f_diesel2")?.checked || false,
                air: document.getElementById("f_air2")?.checked || false
            };
            
            let saved = 0;
            if (!isNaN(c1)) {
                let next1 = calcNext(c1, avgNum1, recordDate);
                window.oils.push({
                    id: window.generateId(),
                    recordedBy: userName,
                    recordedByPhone: userPhone,
                    date: dateStr,
                    site: `${site} - مولد 1`,
                    current: c1,
                    diesel: isNaN(dz1) ? 0 : dz1,
                    avgDailyHours: avgNum1,
                    nextDate: next1,
                    note: n1,
                    filters: f1
                });
                saved++;
            }
            if (!isNaN(c2)) {
                let next2 = calcNext(c2, avgNum2, recordDate);
                window.oils.push({
                    id: window.generateId(),
                    recordedBy: userName,
                    recordedByPhone: userPhone,
                    date: dateStr,
                    site: `${site} - مولد 2`,
                    current: c2,
                    diesel: isNaN(dz2) ? 0 : dz2,
                    avgDailyHours: avgNum2,
                    nextDate: next2,
                    note: n2,
                    filters: f2
                });
                saved++;
            }
            if (saved === 0) {
                if (typeof showToast === 'function') showToast("⚠️ أدخل بيانات مولد واحد على الأقل", "error");
                else alert("أدخل بيانات مولد واحد على الأقل");
                return;
            }
            if (typeof pushToFirebase === 'function') pushToFirebase();
            if (typeof saveToLocal === 'function') saveToLocal();
            if (typeof playSave === 'function') playSave();
            if (typeof showToast === 'function') showToast("✅ تم حفظ صيانة المولدين");
            
            // مسح الحقول المزدوجة
            document.getElementById("o_c1").value = "";
            document.getElementById("o_dz1").value = "";
            document.getElementById("o_avg1").value = "";
            document.getElementById("o_n1").value = "";
            document.getElementById("f_oil1").checked = false;
            document.getElementById("f_diesel1").checked = false;
            document.getElementById("f_air1").checked = false;
            document.getElementById("o_c2").value = "";
            document.getElementById("o_dz2").value = "";
            document.getElementById("o_avg2").value = "";
            document.getElementById("o_n2").value = "";
            document.getElementById("f_oil2").checked = false;
            document.getElementById("f_diesel2").checked = false;
            document.getElementById("f_air2").checked = false;
            
            if (typeof resetOilForm === 'function') resetOilForm();
            if (typeof go === 'function') go('records');
        };
    }

    // ========== 4. ربط الأحداث وتفعيل كل شيء ==========
    function init() {
        // صفحة الزيارة
        let gSite = document.getElementById("g_site");
        if (gSite) {
            gSite.addEventListener("change", fixGeneratorPage);
            gSite.addEventListener("input", () => setTimeout(fixGeneratorPage, 200));
            fixGeneratorPage();
        }
        // صفحة الزيت
        let oSite = document.getElementById("o_site");
        if (oSite) {
            oSite.addEventListener("change", fixOilPage);
            oSite.addEventListener("input", () => setTimeout(fixOilPage, 200));
            fixOilPage();
        }
        console.log("✅ تم تفعيل extras.js - ميزة المولدين لموقع 'بالمس فلج (النخيله)'");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

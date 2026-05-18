document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!window.savedCourses || window.savedCourses.length === 0) return;

        // 1. إنشاء الحاوية بأسلوب مرن يضمن ملاءمة ورقة الـ A4 الطبيعية تماماً
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.maxWidth = "1000px"; // منع تمدد الجدول بشكل مشوه وضمان احتوائه بالكامل
        wrapper.style.margin = "0 auto";
        wrapper.style.padding = "30px";
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.color = "#000000";
        wrapper.style.fontFamily = "'Segoe UI', sans-serif";
        wrapper.style.boxSizing = "border-box";

        // 2. رأس الجدول الكلاسيكي المرتب
        const head = document.createElement("div");
        head.style.textAlign = "center";
        head.style.marginBottom = "30px";
        head.style.borderBottom = "2px solid #000000";
        head.style.paddingBottom = "15px";
        head.innerHTML = `
            <h1 style="font-size: 26px; margin: 0; font-weight: bold; color: #000000;">My Exam Schedule</h1>
            <p style="font-size: 13px; margin: 5px 0 0 0; color: #475569;">Official Academic Timetable</p>
        `;
        wrapper.appendChild(head);

        // 3. بناء الجدول وتأمين الإطار الخارجي (Border) لعدم الانقطاع
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "13px";
        table.style.backgroundColor = "#ffffff";
        // إضافة إطار خارجي قوي للجدول ليظهر كاملاً في الطباعة
        table.style.border = "1px solid #cbd5e1"; 

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9;">
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold;">Course Title (Code)</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 10%;">Sec</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 15%;">Room</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 18%;">Date</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 22%;">Time</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const body = table.querySelector("tbody");
        window.savedCourses.forEach(c => {
            const tr = document.createElement("tr");
            tr.style.pageBreakInside = "avoid"; // منع انقسام الأسطر بين الصفحات
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 12px;"><b>${c.title}</b><br><span style="color:#475569; font-size:11px;">(${c.code})</span></td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${c.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: bold; color: #16a34a">${c.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${c.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${c.time} <span style="color:#475569; font-size:11px;">(${c.period})</span></td>
            `;
            body.appendChild(tr);
        });
        wrapper.appendChild(table);

        // 4. إعدادات التصدير القياسية لورقة الـ A4 الطبيعية والمريحة للطباعة
        const opts = {
            margin:       [15, 15, 15, 15], // هوامش حقيقية وممتازة داخل ورقة الـ A4
            filename:     'Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.5, // رفع الدقة والوضوح لمنع تشوه الخطوط والأطراف
                useCORS: true, 
                backgroundColor: "#ffffff",
                scrollX: 0,
                scrollY: 0
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }, // ورقة A4 عرضية افتراضية ثابتة
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // فحص نوع الجهاز لإضافة تأخير بسيط جداً في الهاتف ليقوم المتصفح برسم الجدول كاملاً قبل التقاطه
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            setTimeout(() => { html2pdf().set(opts).from(wrapper).save(); }, 350);
        } else {
            html2pdf().set(opts).from(wrapper).save();
        }
    });
});

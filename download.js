document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!window.savedCourses || window.savedCourses.length === 0) return;

        // 1. حاوية مخصصة لورقة الـ A4 العمودية الطبيعية (Portrait)
        const wrapper = document.createElement("div");
        wrapper.id = "pdfTempWrapper";
        wrapper.style.width = "100%";
        wrapper.style.maxWidth = "800px"; // حجم مثالي مريح لعرض الورقة العمودية
        wrapper.style.padding = "25px";
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.color = "#000000";
        wrapper.style.fontFamily = "'Segoe UI', sans-serif";
        wrapper.style.boxSizing = "border-box";

        // 2. رأس الجدول الرسمي المنسق للوضع العمودي
        const head = document.createElement("div");
        head.style.textAlign = "center";
        head.style.marginBottom = "25px";
        head.style.borderBottom = "2px solid #0f172a";
        head.style.paddingBottom = "12px";
        head.innerHTML = `
            <h1 style="font-size: 24px; margin: 0; font-weight: bold; color: #0f172a;">My Exam Schedule</h1>
            <p style="font-size: 12px; margin: 5px 0 0 0; color: #475569;">Official Academic Timetable (A4 Portrait)</p>
        `;
        wrapper.appendChild(head);

        // 3. بناء الجدول ليمتد بنسبة 100% ويملأ عرض الورقة بالكامل
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "12px";
        table.style.backgroundColor = "#ffffff";
        table.style.border = "1px solid #cbd5e1"; 

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9;">
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 35%;">Course Title (Code)</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 10%;">Sec</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 15%;">Room</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 18%;">Date</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 22%;">Time</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const body = table.querySelector("tbody");
        window.savedCourses.forEach(c => {
            const tr = document.createElement("tr");
            tr.style.pageBreakInside = "avoid"; 
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 10px; color: #000000;"><b>${c.title}</b><br><span style="color:#475569; font-size:10px;">(${c.code})</span></td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; color: #000000;">${c.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; color: #16a34a;">${c.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; color: #000000;">${c.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; color: #000000;">${c.time} <span style="color:#475569; font-size:10px;">(${c.period})</span></td>
            `;
            body.appendChild(tr);
        });
        wrapper.appendChild(table);

        // 🌟 الخطوة السحرية للهواتف: حقن الجدول في الصفحة بشكل مخفي بصرياً ليراه معالج الهاتف ويصوره
        wrapper.style.position = "fixed";
        wrapper.style.bottom = "-9999px";
        wrapper.style.left = "0";
        wrapper.style.zIndex = "-9999";
        document.body.appendChild(wrapper);

        // 4. إعدادات الطباعة لورقة A4 عمودية طبيعية
        const opts = {
            margin:       [15, 10, 15, 10], 
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.2, // دقة ممتازة وخفيفة على معالجات الهواتف
                useCORS: true, 
                backgroundColor: "#ffffff"
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        const runExport = () => {
            html2pdf().set(opts).from(wrapper).save().then(() => {
                // تنظيف الصفحة وحذف الحاوية فوراً بعد انتهاء التحميل
                wrapper.remove();
            });
        };

        if (isMobile) {
            // إعطاء شاشة الهاتف 400 جزء من الثانية لتستوعب وجود الجدول قبل التقاطه
            setTimeout(runExport, 400);
        } else {
            runExport();
        }
    });
});

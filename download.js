document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!window.savedCourses || window.savedCourses.length === 0) return;

        // 1. حاوية مرنة مخصصة لورقة الـ A4 العمودية الطبيعية (Portrait)
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.padding = "10px";
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
        table.style.border = "1px solid #cbd5e1"; // تأمين الحدود الخارجية لمنع القص

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
            tr.style.pageBreakInside = "avoid"; // منع انقسام أسطر المادة الواحدة
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 10px;"><b>${c.title}</b><br><span style="color:#475569; font-size:10px;">(${c.code})</span></td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${c.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; color: #16a34a">${c.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${c.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${c.time} <span style="color:#475569; font-size:10px;">(${c.period})</span></td>
            `;
            body.appendChild(tr);
        });
        wrapper.appendChild(table);

        // 4. إعدادات الطباعة لورقة A4 عمودية طبيعية بدون أي أبعاد كوستوم مخربة
        const opts = {
            margin:       [15, 10, 15, 10], // هوامش متناسقة وممتازة للورقة العمودية
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.5, // دقة عالية جداً للخطوط والنصوص
                useCORS: true, 
                backgroundColor: "#ffffff"
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }, // 🌟 السحر هنا: تحويل لورقة A4 عمودية رسمية
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // فحص الهاتف لضمان عدم حدوث قص أثناء المعالجة
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
            // إعطاء المتصفح مهلة بسيطة لتهيئة العرض العمودي بالكامل
            setTimeout(() => { html2pdf().set(opts).from(wrapper).save(); }, 300);
        } else {
            html2pdf().set(opts).from(wrapper).save();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!window.savedCourses || window.savedCourses.length === 0) return;

        // 1. بناء حاوية عادية بدون أي مقاس كوستوم (تتبع عرض شاشة الجهاز تلقائياً)
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.padding = "20px";
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.color = "#000000";
        wrapper.style.fontFamily = "'Segoe UI', sans-serif";

        // 2. رأس الجدول الكلاسيكي
        const head = document.createElement("div");
        head.style.textAlign = "center";
        head.style.marginBottom = "20px";
        head.style.borderBottom = "2px solid #000000";
        head.style.paddingBottom = "10px";
        head.innerHTML = `
            <h1 style="font-size: 24px; margin: 0; font-weight: bold;">My Exam Schedule</h1>
            <p style="font-size: 12px; margin: 5px 0 0 0; color: #475569;">Official Academic Timetable</p>
        `;
        wrapper.appendChild(head);

        // 3. بناء جدول مرن وطبيعي
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "13px";

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9;">
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold;">Course Title (Code)</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 10%;">Sec</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 15%;">Room</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 15%;">Date</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 20%;">Time</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const body = table.querySelector("tbody");
        window.savedCourses.forEach(c => {
            const tr = document.createElement("tr");
            tr.style.pageBreakInside = "avoid"; // منع قطع السطر الواحد بين الصفحات
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 10px;"><b>${c.title}</b><br>(${c.code})</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${c.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; color: #16a34a">${c.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${c.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${c.time} (${c.period})</td>
            `;
            body.appendChild(tr);
        });
        wrapper.appendChild(table);

        // 4. إعدادات التصدير الطبيعية القياسية لورقة الـ A4 بدون أي أبعاد كوستوم
        const opts = {
            margin:       [15, 15, 15, 15], // هوامش عادية ومريحة حول الورقة
            filename:     'Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.0, 
                useCORS: true, 
                backgroundColor: "#ffffff" 
                // 🚫 تم مسح الـ width والـ windowWidth الكوستوم نهائياً من هنا بناءً على فكرتك
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }, // ورقة A4 طبيعية ومضمونة عالمياً
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // يفتح صفحة جديدة تلقائياً إذا زادت المواد
        };

        // تشغيل التنزيل مباشرة
        html2pdf().set(opts).from(wrapper).save();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!window.savedCourses || window.savedCourses.length === 0) {
            alert("Your schedule is empty! Add courses first.");
            return;
        }

        // 1. إنشاء حاوية برمجية بيضاء بالمقاس العادي الطبيعي للورقة
        const printWrapper = document.createElement("div");
        printWrapper.style.width = "100%";
        printWrapper.style.padding = "20px";
        printWrapper.style.backgroundColor = "#ffffff";
        printWrapper.style.color = "#000000";
        printWrapper.style.fontFamily = "'Segoe UI', sans-serif";

        // 2. رأس الجدول الكلاسيكي البسيط
        const headerDiv = document.createElement("div");
        headerDiv.style.textAlign = "center";
        headerDiv.style.marginBottom = "25px";
        headerDiv.style.borderBottom = "2px solid #000000";
        headerDiv.style.paddingBottom = "15px";
        headerDiv.innerHTML = `
            <h1 style="font-size: 24px; color: #000000; margin: 0 0 5px 0; font-weight: bold;">My Exam Schedule</h1>
            <p style="font-size: 12px; color: #475569; margin: 0;">Official Academic Timetable</p>
        `;
        printWrapper.appendChild(headerDiv);

        // 3. بناء الجدول بالمقاس العادي الافتراضي
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "13px";
        table.style.color = "#000000";
        table.style.pageBreakInside = "auto";

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9; page-break-inside: avoid;">
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold;">Course Title (Code)</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 10%;">Sec</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 15%;">Room / Hall</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 15%;">Exam Date</th>
                    <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-weight: bold; width: 20%;">Time & Period</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector("tbody");

        window.savedCourses.forEach(course => {
            const tr = document.createElement("tr");
            tr.style.pageBreakInside = "avoid";
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold;">${course.title} <span style="font-weight: normal; color:#475569; font-size:11px;"><br>(${course.code})</span></td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${course.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px; font-weight: bold; color: #16a34a;">${course.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${course.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 10px;">${course.time} <span style="color:#475569; font-size:11px;">(${course.period})</span></td>
            `;
            tbody.appendChild(tr);
        });

        printWrapper.appendChild(table);

        // 4. إعدادات التصدير الافتراضية العادية لورقة الـ A4
        const options = {
            margin:       [15, 15, 15, 15], // هوامش طبيعية كلاسيكية حول الورقة
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.0, // دقة ممتازة واضحة
                useCORS: true,
                backgroundColor: "#ffffff" // خلفية بيضاء عادية ومريحة للطباعة
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }, // مقاس A4 القياسي بالميليمتر
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const generateAndSave = () => {
            html2pdf().set(options).from(printWrapper).save();
        };

        if (isMobile) {
            setTimeout(generateAndSave, 300);
        } else {
            generateAndSave();
        }
    });
});

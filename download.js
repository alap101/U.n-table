document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!window.savedCourses || window.savedCourses.length === 0) {
            alert("Your schedule is empty! Add courses first.");
            return;
        }

        // 1. إنشاء حاوية برمجية مستقلة تماماً داخل الذاكرة من أجل الـ PDF
        const printWrapper = document.createElement("div");
        printWrapper.style.width = "275mm"; // حجم ثابت لورقة الـ A4 بالعرض
        printWrapper.style.padding = "20px";
        printWrapper.style.backgroundColor = "#ffffff";
        printWrapper.style.color = "#000000";
        printWrapper.style.fontFamily = "'Segoe UI', sans-serif";

        // 2. رأس الجدول النظيف والمنظم
        const headerDiv = document.createElement("div");
        headerDiv.style.textAlign = "center";
        headerDiv.style.marginBottom = "25px";
        headerDiv.style.borderBottom = "3px solid #0f172a";
        headerDiv.style.paddingBottom = "15px";
        headerDiv.innerHTML = `
            <h1 style="font-size: 26px; color: #0f172a; margin-bottom: 5px; font-weight: bold;">My Exam Schedule</h1>
            <p style="font-size: 13px; color: #475569; margin: 0;">Generated smoothly on mobile & desktop</p>
        `;
        printWrapper.appendChild(headerDiv);

        // 3. بناء الجدول الأبيض الكلاسيكي المخصص للطباعة
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "13px";
        table.style.color = "#000000";

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9;">
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 35%;">Course Title (Code)</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 10%;">Sec</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 15%;">Room / Hall</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 20%;">Exam Date</th>
                    <th style="border: 1px solid #cbd5e1; padding: 12px; text-align: left; font-weight: bold; width: 20%;">Time & Period</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector("tbody");

        window.savedCourses.forEach(course => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: bold;">${course.title} <span style="font-weight: normal; color:#475569; font-size:11px;"><br>(${course.code})</span></td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${course.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px; font-weight: bold; color: #16a34a;">${course.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${course.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 12px;">${course.time} <span style="color:#475569; font-size:11px;">(${course.period})</span></td>
            `;
            tbody.appendChild(tr);
        });

        printWrapper.appendChild(table);

        // 4. ✨ كود سحري مخصص للهواتف: يجبر المتصفح على محاكاة شاشة عريضة أثناء التصوير لمنع الانكماش والبياض
        const options = {
            margin:       [10, 10, 10, 10],
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.5, // دقة عالية جداً للخطوط
                useCORS: true,
                backgroundColor: "#ffffff",
                width: 1040, // عرض الورقة الافتراضي بالبكسل
                windowWidth: 1040 // 🌟 هذا السطر يخدع متصفح الهاتف ويجعله يعامل الجدول كأنه معروض على شاشة لابتوب عريضة
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        // تشغيل نظام التنزيل
        html2pdf().set(options).from(printWrapper).save();
    });
});

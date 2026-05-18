document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!window.savedCourses || window.savedCourses.length === 0) {
            alert("Your schedule is empty! Add courses first.");
            return;
        }

        // 1. إنشاء حاوية برمجية بيضاء نظيفة مستقلة تماماً داخل الذاكرة من أجل الـ PDF
        const printWrapper = document.createElement("div");
        printWrapper.style.width = "270mm"; // عرض ورقة الـ A4 الأفقية الثابت
        printWrapper.style.backgroundColor = "#ffffff";
        printWrapper.style.color = "#000000";
        printWrapper.style.fontFamily = "'Segoe UI', sans-serif";
        printWrapper.style.padding = "10px";

        // 2. تصميم رأس الجدول المستقل الواضح
        const headerDiv = document.createElement("div");
        headerDiv.style.textAlign = "center";
        headerDiv.style.marginBottom = "20px";
        headerDiv.style.borderBottom = "2px solid #0f172a";
        headerDiv.style.paddingBottom = "10px";
        headerDiv.innerHTML = `
            <h1 style="font-size: 26px; color: #0f172a; margin: 0 0 5px 0; font-weight: bold;">My Official Exam Schedule</h1>
            <p style="font-size: 13px; color: #475569; margin: 0;">Generated smoothly on mobile & desktop</p>
        `;
        printWrapper.appendChild(headerDiv);

        // 3. بناء الجدول الطبيعي والأبيض بالكامل المخصص للطباعة مع دعم الانقسام التلقائي
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "13px";
        table.style.color = "#000000";
        // خاصية إجبار المتصفح على تقسيم الصفوف بأمان بين الصفحات
        table.style.pageBreakInside = "auto"; 

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9; page-break-inside: avoid; page-break-after: auto;">
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

        // ملء صفوف الجدول مع منع انقسام السطر الواحد في منتصفه (تأتي المادة كاملة بالصفحة الجديدة)
        window.savedCourses.forEach(course => {
            const tr = document.createElement("tr");
            tr.style.pageBreakInside = "avoid"; // منع قطع السطر الواحد لنصفين بين الصفحات
            tr.style.pageBreakAfter = "auto";
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

        // 4. فحص نوع الجهاز برمجياً لتطبيق الإعداد المناسب له
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const html2canvasOptions = {
            scale: 2.5, // دقة عالية جداً للخطوط لمنع البكسلة
            useCORS: true,
            backgroundColor: "#ffffff"
        };

        if (isMobile) {
            html2canvasOptions.width = 1020;
            html2canvasOptions.windowWidth = 1020;
        }

        const options = {
            margin:       [10, 10, 10, 10],
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  html2canvasOptions,
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' },
            // 🌟 الإعداد السحري لتقطيع الصفحات تلقائياً بناءً على العناصر والمساحة المتاحة
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

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

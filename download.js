document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!window.savedCourses || window.savedCourses.length === 0) {
            alert("Your schedule is empty! Add courses first.");
            return;
        }

        // 1. تثبيت أبعاد ورقة الـ A4 العرضية بالبكسل بشكل صارم وموحد لجميع الأجهزة
        const printWrapper = document.createElement("div");
        printWrapper.style.width = "1123px"; // العرض الحقيقي لـ A4 بدقة الطباعة
        printWrapper.style.minHeight = "794px"; // الارتفاع الأدنى لـ A4
        printWrapper.style.boxSizing = "border-box";
        printWrapper.style.padding = "40px"; // هوامش الورقة الداخلية
        printWrapper.style.backgroundColor = "#ffffff";
        printWrapper.style.color = "#000000";
        printWrapper.style.fontFamily = "'Segoe UI', sans-serif";

        // 2. رأس الجدول النظيف
        const headerDiv = document.createElement("div");
        headerDiv.style.textAlign = "center";
        headerDiv.style.marginBottom = "30px";
        headerDiv.style.borderBottom = "3px solid #0f172a";
        headerDiv.style.paddingBottom = "15px";
        headerDiv.innerHTML = `
            <h1 style="font-size: 28px; color: #0f172a; margin: 0 0 5px 0; font-weight: bold; letter-spacing: 0.5px;">My Official Exam Schedule</h1>
            <p style="font-size: 14px; color: #475569; margin: 0;">Perfectly aligned on A4 Landscape Page</p>
        `;
        printWrapper.appendChild(headerDiv);

        // 3. بناء الجدول ممتد بنسبة 100% داخل أبعاد الـ A4
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.fontSize = "14px";
        table.style.color = "#000000";
        table.style.pageBreakInside = "auto";

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f8fafc; page-break-inside: avoid;">
                    <th style="border: 1px solid #cbd5e1; padding: 14px; text-align: left; font-weight: bold; width: 35%;">Course Title (Code)</th>
                    <th style="border: 1px solid #cbd5e1; padding: 14px; text-align: left; font-weight: bold; width: 10%;">Sec</th>
                    <th style="border: 1px solid #cbd5e1; padding: 14px; text-align: left; font-weight: bold; width: 15%;">Room / Hall</th>
                    <th style="border: 1px solid #cbd5e1; padding: 14px; text-align: left; font-weight: bold; width: 20%;">Exam Date</th>
                    <th style="border: 1px solid #cbd5e1; padding: 14px; text-align: left; font-weight: bold; width: 20%;">Time & Period</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector("tbody");

        // ملء البيانات وتطبيق حماية الفواصل لمنع قطع الصفوف
        window.savedCourses.forEach(course => {
            const tr = document.createElement("tr");
            tr.style.pageBreakInside = "avoid";
            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 14px; font-weight: bold; color: #0f172a;">${course.title} <span style="font-weight: normal; color:#475569; font-size:12px;"><br>(${course.code})</span></td>
                <td style="border: 1px solid #cbd5e1; padding: 14px;">${course.section}</td>
                <td style="border: 1px solid #cbd5e1; padding: 14px; font-weight: bold; color: #16a34a;">${course.room}</td>
                <td style="border: 1px solid #cbd5e1; padding: 14px;">${course.date}</td>
                <td style="border: 1px solid #cbd5e1; padding: 14px;">${course.time} <span style="color:#475569; font-size:12px;">(${course.period})</span></td>
            `;
            tbody.appendChild(tr);
        });

        printWrapper.appendChild(table);

        // 4. ضبط إعدادات التصدير الموحدة (المحاذاة المباشرة)
        const options = {
            margin:       [0, 0, 0, 0], // الهوامش صفر لأننا ضبطنا الـ padding مسبقاً وبدقة بالبكسل
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2.0, // جودة ممتازة متزنة ومناسبة لمعالجات الهواتف والويندوز
                useCORS: true,
                backgroundColor: "#ffffff",
                width: 1123, // فرض التقاط العرض المخصص للـ A4 بالتمام
                windowWidth: 1123 // ضبط متصفح الهاتف ليعتمد مساحة عرض لابتوب واسعة
            },
            jsPDF:        { unit: 'px', format: [1123, 794], orientation: 'landscape' }, // تمرير أبعاد الـ A4 بالبكسل رسمياً للمكتبة
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // فحص نوع الجهاز للتأخير فقط، الحاوية والإعدادات ثابتة للطرفين!
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const generateAndSave = () => {
            html2pdf().set(options).from(printWrapper).save();
        };

        if (isMobile) {
            setTimeout(generateAndSave, 400); // إعطاء الهاتف وقت كافي لرسم الأبعاد بدقة
        } else {
            generateAndSave();
        }
    });
});

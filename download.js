document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!window.savedCourses || window.savedCourses.length === 0) return;

        // كشف الهاتف
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        // إنشاء الحاوية الرئيسية
        const wrapper = document.createElement("div");

        // عرض ثابت مناسب لـ A4
        wrapper.style.width = "794px";
        wrapper.style.maxWidth = "100%";

        wrapper.style.padding = "10px";
        wrapper.style.backgroundColor = "#ffffff";
        wrapper.style.color = "#000000";
        wrapper.style.fontFamily = "'Segoe UI', sans-serif";
        wrapper.style.boxSizing = "border-box";

        // منع مشاكل التموضع بالجوال
        wrapper.style.position = "relative";

        // رأس الصفحة
        const head = document.createElement("div");
        head.style.textAlign = "center";
        head.style.marginBottom = "25px";
        head.style.borderBottom = "2px solid #0f172a";
        head.style.paddingBottom = "12px";

        head.innerHTML = `
            <h1 style="font-size: 24px; margin: 0; font-weight: bold; color: #0f172a;">
                My Exam Schedule
            </h1>

            <p style="font-size: 12px; margin: 5px 0 0 0; color: #475569;">
                Official Academic Timetable (A4 Portrait)
            </p>
        `;

        wrapper.appendChild(head);

        // الجدول
        const table = document.createElement("table");

        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.tableLayout = "fixed";
        table.style.wordBreak = "break-word";

        table.style.fontSize = isMobile ? "10px" : "12px";

        table.style.backgroundColor = "#ffffff";
        table.style.border = "1px solid #cbd5e1";

        table.innerHTML = `
            <thead>
                <tr style="background-color: #f1f5f9;">
                    <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 35%;">
                        Course Title (Code)
                    </th>

                    <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 10%;">
                        Sec
                    </th>

                    <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 15%;">
                        Room
                    </th>

                    <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 18%;">
                        Date
                    </th>

                    <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left; width: 22%;">
                        Time
                    </th>
                </tr>
            </thead>

            <tbody></tbody>
        `;

        const body = table.querySelector("tbody");

        window.savedCourses.forEach(c => {

            const tr = document.createElement("tr");

            tr.style.pageBreakInside = "avoid";

            tr.innerHTML = `
                <td style="border: 1px solid #cbd5e1; padding: 8px;">
                    <b>${c.title}</b><br>
                    <span style="color:#475569; font-size:9px;">
                        (${c.code})
                    </span>
                </td>

                <td style="border: 1px solid #cbd5e1; padding: 8px;">
                    ${c.section}
                </td>

                <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; color: #16a34a">
                    ${c.room}
                </td>

                <td style="border: 1px solid #cbd5e1; padding: 8px;">
                    ${c.date}
                </td>

                <td style="border: 1px solid #cbd5e1; padding: 8px;">
                    ${c.time}
                    <span style="color:#475569; font-size:9px;">
                        (${c.period})
                    </span>
                </td>
            `;

            body.appendChild(tr);
        });

        wrapper.appendChild(table);

        // مهم جداً للجوال
        document.body.appendChild(wrapper);

        // إعدادات PDF
        const opts = {
            margin: [10, 8, 10, 8],

            filename: 'My_Exam_Schedule.pdf',

            image: {
                type: 'jpeg',
                quality: 0.98
            },

            html2canvas: {
                scale: isMobile ? 1.2 : 2.2,
                useCORS: true,
                backgroundColor: "#ffffff",
                scrollY: 0
            },

            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },

            // avoid-all يسبب مشاكل بالجوال
            pagebreak: {
                mode: ['css', 'legacy']
            }
        };

        // مهلة بسيطة للجوال
        setTimeout(() => {

            html2pdf()
                .set(opts)
                .from(wrapper)
                .save()
                .then(() => {

                    // حذف العنصر بعد الحفظ
                    document.body.removeChild(wrapper);

                });

        }, isMobile ? 400 : 0);
    });
});

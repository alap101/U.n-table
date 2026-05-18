document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!window.savedCourses || window.savedCourses.length === 0) return;

        // بناء الحاوية العادية التلقائية للورقة الكلاسيكية
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%"; wrapper.style.padding = "25px"; wrapper.style.backgroundColor = "#ffffff"; wrapper.style.color = "#000000";

        const head = document.createElement("div");
        head.style.textAlign = "center"; head.style.marginBottom = "20px"; head.style.borderBottom = "2px solid #000"; head.style.paddingBottom = "10px";
        head.innerHTML = `<h1 style="font-size:22px;margin:0;">My Exam Schedule</h1><p style="font-size:12px;margin:5px 0 0 0;color:#475569;">Official Academic Timetable</p>`;
        wrapper.appendChild(head);

        const table = document.createElement("table");
        table.style.width = "100%"; table.style.borderCollapse = "collapse"; table.style.fontSize = "12px";

        table.innerHTML = `
            <thead>
                <tr style="background-color:#f1f5f9;">
                    <th style="border:1px solid #cbd5e1;padding:10px;text-align:left;">Course Title (Code)</th>
                    <th style="border:1px solid #cbd5e1;padding:10px;text-align:left;width:10%;">Sec</th>
                    <th style="border:1px solid #cbd5e1;padding:10px;text-align:left;width:15%;">Room</th>
                    <th style="border:1px solid #cbd5e1;padding:10px;text-align:left;width:15%;">Date</th>
                    <th style="border:1px solid #cbd5e1;padding:10px;text-align:left;width:20%;">Time</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const body = table.querySelector("tbody");
        window.savedCourses.forEach(c => {
            const tr = document.createElement("tr"); tr.style.pageBreakInside = "avoid";
            tr.innerHTML = `<td style="border:1px solid #cbd5e1;padding:10px;"><b>${c.title}</b><br>(${c.code})</td><td style="border:1px solid #cbd5e1;padding:10px;">${c.section}</td><td style="border:1px solid #cbd5e1;padding:10px;font-weight:bold;color:#16a34a">${c.room}</td><td style="border:1px solid #cbd5e1;padding:10px;">${c.date}</td><td style="border:1px solid #cbd5e1;padding:10px;">${c.time} (${c.period})</td>`;
            body.appendChild(tr);
        });
        wrapper.appendChild(table);

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const opts = {
            margin: [15, 15, 15, 15], filename: 'Exam_Schedule.pdf', image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2.0, useCORS: true, backgroundColor: "#ffffff" },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        if(isMobile) {
            opts.html2canvas.width = 950; opts.html2canvas.windowWidth = 950;
            setTimeout(() => { html2pdf().set(opts).from(wrapper).save(); }, 300);
        } else {
            html2pdf().set(opts).from(wrapper).save();
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const excelFileInput = document.getElementById("excelFileInput");
    const fileStatus = document.getElementById("fileStatus");
    const searchBox = document.getElementById("searchBox");
    
    const titleInput = document.getElementById("titleInput");
    const titleDropdown = document.getElementById("titleDropdown");
    const sectionInput = document.getElementById("sectionInput");
    const sectionDropdown = document.getElementById("sectionDropdown");
    const resultCard = document.getElementById("resultCard");
    const noResults = document.getElementById("noResults");
    const addToScheduleBtn = document.getElementById("addToScheduleBtn");
    const myScheduleSection = document.getElementById("myScheduleSection");
    const scheduleBody = document.getElementById("scheduleBody");
    const downloadPdfBtn = document.getElementById("downloadPdfBtn");

    let examData = []; 
    let uniqueTitles = [];
    let currentMatch = null; 
    let savedCourses = []; 

    // قراءة ملف الـ XLSX ديناميكياً باستخدام مكتبة SheetJS
    excelFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // قراءة ورقة العمل الأولى داخل ملف الإكسل
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // تحويل الورقة إلى مصفوفة كائنات جافاسكريبت (JSON)
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            processExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    });

    // دالة لربط وتنسيق بيانات الإكسل لتطابق واجهة البحث والـ PDF
    function processExcelData(data) {
        examData = data.map(row => {
            return {
                code: row["Crs. Code"] || row["code"] || "",
                title: row["Course Title"] || row["title"] || "",
                section: row["Section"] || row["section"] || "",
                room: row["Room"] || row["room"] || "",
                date: row["Exam Date"] || row["date"] || "",
                period: row["Period"] || row["period"] || "",
                time: row["Time"] || row["time"] || ""
            };
        }).filter(item => item.title !== ""); // استبعاد السطور الفارغة إن وجدت

        if (examData.length > 0) {
            uniqueTitles = [...new Set(examData.map(item => item.title))].sort();
            fileStatus.style.display = "block";
            searchBox.style.display = "block"; 
            
            // إعادة تهيئة الواجهة
            savedCourses = [];
            scheduleBody.innerHTML = "";
            myScheduleSection.style.display = "none";
            resultCard.style.display = "none";
            titleInput.value = "";
            sectionInput.value = "";
            sectionInput.disabled = true;
        } else {
            alert("Could not find correct columns. Please ensure columns match ('Course Title', 'Section', etc.)");
        }
    }

    // ميزات البحث والـ Dropdown المدمجة والذكية
    function initTitleDropdown(filterText = "") {
        titleDropdown.innerHTML = "";
        const filtered = uniqueTitles.filter(t => t.toLowerCase().includes(filterText.toLowerCase()));
        
        if(filtered.length === 0) {
            titleDropdown.style.display = "none";
            return;
        }

        filtered.forEach(title => {
            const div = document.createElement("div");
            div.textContent = title;
            div.addEventListener("click", () => {
                titleInput.value = title;
                titleDropdown.style.display = "none";
                enableSectionDropdown(title);
            });
            titleDropdown.appendChild(div);
        });
        titleDropdown.style.display = "block";
    }

    titleInput.addEventListener("focus", () => initTitleDropdown(titleInput.value));
    titleInput.addEventListener("input", () => initTitleDropdown(titleInput.value));

    function enableSectionDropdown(courseTitle) {
        sectionInput.value = "";
        sectionInput.disabled = false;
        sectionDropdown.innerHTML = "";
        currentMatch = null;
        resultCard.style.display = "none";

        const sections = examData.filter(item => item.title === courseTitle).map(item => item.section);
        
        sections.forEach(sec => {
            const div = document.createElement("div");
            div.textContent = `Section ${sec}`;
            div.addEventListener("click", () => {
                sectionInput.value = sec;
                sectionDropdown.style.display = "none";
                triggerFinalSearch(courseTitle, sec);
            });
            sectionDropdown.appendChild(div);
        });
    }

    sectionInput.addEventListener("focus", () => {
        if(!sectionInput.disabled) sectionDropdown.style.display = "block";
    });
    
    sectionInput.addEventListener("input", () => {
        const title = titleInput.value;
        const val = sectionInput.value.trim();
        const divs = sectionDropdown.querySelectorAll("div");
        let hasMatch = false;

        divs.forEach(div => {
            if(div.textContent.includes(val)) {
                div.style.display = "block";
                hasMatch = true;
            } else {
                div.style.display = "none";
            }
        });
        sectionDropdown.style.display = hasMatch ? "block" : "none";
        triggerFinalSearch(title, val);
    });

    function triggerFinalSearch(title, section) {
        if (!title || !section) return;
        const match = examData.find(item => item.title.toLowerCase() === title.toLowerCase() && item.section.toString() === section.toString());
        
        if (match) {
            currentMatch = match;
            document.getElementById("resTitle").textContent = match.title;
            document.getElementById("resCode").textContent = `Code: ${match.code}`;
            document.getElementById("resSection").textContent = match.section;
            document.getElementById("resRoom").textContent = match.room;
            document.getElementById("resDate").textContent = match.date;
            document.getElementById("resTime").textContent = `${match.time} (${match.period})`;
            resultCard.style.display = "block";
            noResults.style.display = "none";
        } else {
            currentMatch = null;
            resultCard.style.display = "none";
            if (section.length >= 1) noResults.style.display = "block";
        }
    }

    document.addEventListener("click", (e) => {
        if (e.target !== titleInput && e.target !== titleDropdown) titleDropdown.style.display = "none";
        if (e.target !== sectionInput && e.target !== sectionDropdown) sectionDropdown.style.display = "none";
    });

    addToScheduleBtn.addEventListener("click", () => {
        if (!currentMatch) return;
        const isAlreadyAdded = savedCourses.some(item => item.code === currentMatch.code && item.section === currentMatch.section);
        if (isAlreadyAdded) {
            alert("This course section is already in your schedule!");
            return;
        }
        savedCourses.push(currentMatch);
        updateScheduleTable();
        titleInput.value = "";
        sectionInput.value = "";
        sectionInput.disabled = true;
        resultCard.style.display = "none";
    });

    function updateScheduleTable() {
        scheduleBody.innerHTML = "";
        if (savedCourses.length === 0) {
            myScheduleSection.style.display = "none";
            return;
        }
        savedCourses.forEach((course, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="color:#000; font-weight:600;">${course.title}<br><small style="color:#64748b">${course.code}</small></td>
                <td style="color:#000">${course.section}</td>
                <td style="color:#10b981; font-weight:bold;">${course.room}</td>
                <td style="color:#000">${course.date}</td>
                <td style="color:#000">${course.time} (${course.period})</td>
                <td class="no-print"><button class="btn-delete" data-index="${index}">❌</button></td>
            `;
            scheduleBody.appendChild(tr);
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                savedCourses.splice(idx, 1);
                updateScheduleTable();
            });
        });
        myScheduleSection.style.display = "block";
    }

    downloadPdfBtn.addEventListener("click", () => {
        const deleteButtons = document.querySelectorAll(".no-print");
        deleteButtons.forEach(el => el.style.display = "none");
        const element = document.getElementById("pdfArea");
        const options = {
            margin:       [10, 10, 10, 10],
            filename:     'My_Exam_Schedule.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(options).from(element).save().then(() => {
            deleteButtons.forEach(el => el.style.display = "table-cell");
        });
    });
});

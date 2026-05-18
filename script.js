document.addEventListener("DOMContentLoaded", () => {
    const excelFileInput = document.getElementById("excelFileInput");
    const dropZone = document.getElementById("dropZone");
    const uploadPrompt = document.getElementById("uploadPrompt");
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

    function formatExcelDate(excelDate) {
        if (!excelDate) return "";
        if (isNaN(excelDate)) return excelDate; 
        
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    }

    dropZone.addEventListener("click", () => {
        excelFileInput.click();
    });

    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("dragover");
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) handleFile(file);
    });

    excelFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    function handleFile(file) {
        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
            alert("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            processExcelData(jsonData, file.name);
        };
        reader.readAsArrayBuffer(file);
    }

    function processExcelData(data, fileName) {
        examData = data.map(row => {
            const rawDate = row["Exam Date"] || row["date"] || "";
            const formattedDate = formatExcelDate(rawDate);

            return {
                code: row["Crs. Code"] || row["code"] || "",
                title: row["Course Title"] || row["title"] || "",
                section: row["Section"] || row["section"] || "",
                room: row["Room"] || row["room"] || "",
                date: formattedDate,
                period: row["Period"] || row["period"] || "",
                time: row["Time"] || row["time"] || ""
            };
        }).filter(item => item.title !== "");

        if (examData.length > 0) {
            uniqueTitles = [...new Set(examData.map(item => item.title))].sort();
            
            uploadPrompt.textContent = `Active File: ${fileName}`;
            fileStatus.style.display = "block";
            searchBox.style.display = "block"; 
            
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

    function initTitleDropdown(filterText = "") {
        titleDropdown.innerHTML = "";
        const filtered = uniqueTitles.filter(t => t.toLowerCase().includes(filterText.toLowerCase()));
        if(filtered.length === 0) { titleDropdown.style.display = "none"; return; }

        filtered.forEach(title => {
            const div = document.createElement("div");
            div.textContent = title;
            div.addEventListener("click", (e) => {
                e.stopPropagation(); 
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
            div.addEventListener("click", (e) => {
                e.stopPropagation();
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
            if(div.textContent.includes(val)) { div.style.display = "block"; hasMatch = true; } 
            else { div.style.display = "none"; }
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

    addToScheduleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!currentMatch) return;
        const isAlreadyAdded = savedCourses.some(item => item.code === currentMatch.code && item.section === currentMatch.section);
        if (isAlreadyAdded) { alert("This course section is already in your schedule!"); return; }
        
        savedCourses.push(currentMatch);
        updateScheduleTable();
        titleInput.value = "";
        sectionInput.value = "";
        sectionInput.disabled = true;
        resultCard.style.display = "none";
    });

    function updateScheduleTable() {
        scheduleBody.innerHTML = "";
        if (savedCourses.length === 0) { myScheduleSection.style.display = "none"; return; }
        savedCourses.forEach((course, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="course-td">${course.title}<div class="course-code-sub">${course.code}</div></td>
                <td style="color:#fff;">${course.section}</td>
                <td class="room-td">${course.room}</td>
                <td style="color:#fff;">${course.date}</td>
                <td style="color:#fff;">${course.time} <span style="color:#94a3b8; font-size:0.8rem;">(${course.period})</span></td>
                <td class="no-print"><button class="btn-delete" data-index="${index}">❌</button></td>
            `;
            scheduleBody.appendChild(tr);
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = e.target.getAttribute("data-index");
                savedCourses.splice(idx, 1);
                updateScheduleTable();
            });
        });
        myScheduleSection.style.display = "block";
    }

    // تشغيل ميزة الطباعة الرسمية والذكية للنظام لإنتاج PDF طبيعي ونظيف 100%
    downloadPdfBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.print(); // يفتح نافذة الـ PDF الرسمية والآمنة للجهاز فوراً
    });
});

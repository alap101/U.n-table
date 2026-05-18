document.addEventListener("DOMContentLoaded", () => {
    const typeTitle = document.getElementById("typeTitle");
    const typeSection = document.getElementById("typeSection");
    const selectTitle = document.getElementById("selectTitle");
    const selectSection = document.getElementById("selectSection");
    const resultCard = document.getElementById("resultCard");
    const noResults = document.getElementById("noResults");

    // ملء قائمة أسماء المواد أبجدياً بدون تكرار
    const uniqueTitles = [...new Set(examData.map(item => item.title))].sort();
    uniqueTitles.forEach(title => {
        const option = document.createElement("option");
        option.value = title;
        option.textContent = title;
        selectTitle.appendChild(option);
    });

    // التحكم في خيار القوائم المنسدلة
    selectTitle.addEventListener("change", () => {
        const selectedTitle = selectTitle.value;
        selectSection.innerHTML = '<option value="">Select Section</option>';
        if (!selectedTitle) { selectSection.disabled = true; hideResult(); return; }

        typeTitle.value = ""; typeSection.value = ""; // تصفير خانات الكتابة

        const filteredSections = examData.filter(item => item.title === selectedTitle).map(item => item.section);
        filteredSections.forEach(sec => {
            const option = document.createElement("option");
            option.value = sec; option.textContent = `Section ${sec}`;
            selectSection.appendChild(option);
        });
        selectSection.disabled = false;
        hideResult();
    });

    selectSection.addEventListener("change", () => {
        searchExam(selectTitle.value, selectSection.value, false);
    });

    // التحكم في خيار الكتابة والبحث الفوري
    function handleTypeSearch() {
        selectTitle.value = ""; selectSection.innerHTML = '<option value="">Select Section</option>'; selectSection.disabled = true;
        const titleVal = typeTitle.value.trim().toLowerCase();
        const secVal = typeSection.value.trim();
        if (titleVal === "") { hideResult(); return; }
        searchExam(titleVal, secVal, true);
    }

    typeTitle.addEventListener("input", handleTypeSearch);
    typeSection.addEventListener("input", handleTypeSearch);

    function searchExam(title, section, isTyping = false) {
        let match = null;
        if (isTyping) {
            match = examData.find(item => item.title.toLowerCase().includes(title) && (section === "" || item.section.toString() === section));
        } else {
            if (title && section) match = examData.find(item => item.title === title && item.section.toString() === section);
        }

        if (match) { showResult(match); } 
        else { if (isTyping && title.length > 2) { resultCard.style.display = "none"; noResults.style.display = "block"; } else { hideResult(); } }
    }

    function showResult(data) {
        document.getElementById("resTitle").textContent = data.title;
        document.getElementById("resCode").textContent = `Course Code: ${data.code}`;
        document.getElementById("resSection").textContent = data.section;
        document.getElementById("resRoom").textContent = data.room;
        document.getElementById("resDate").textContent = data.date;
        document.getElementById("resTime").textContent = `${data.time} (${data.period})`;
        resultCard.style.display = "block"; noResults.style.display = "none";
    }

    function hideResult() { resultCard.style.display = "none"; noResults.style.display = "none"; }
});

/* =========================================
   HOMEPAGE SEARCH
========================================= */

function performSearch() {

    const input = document.getElementById("mainSearch");

    if (!input) return;

    const searchValue = input.value.trim();

    if (searchValue === "") {
        input.focus();
        input.placeholder = "Try searching for a treatment...";
        return;
    }

    window.location.href =
        "treatments.html?search=" +
        encodeURIComponent(searchValue);
}


function quickSearch(value) {

    if (!value) return;

    window.location.href =
        "treatments.html?search=" +
        encodeURIComponent(value);
}


/* =========================================
   SPA ROUTER
   (Existing homepage functionality)
========================================= */

function navigate(e, path) {

    e.preventDefault();

    window.location.hash = path;

    handleRoute();
}


function handleRoute() {

    const path = window.location.hash;

    document
        .querySelectorAll("main > section")
        .forEach(function (section) {

            section.style.display = "none";
        });


    if (path.includes("compare-cost")) {

        const compareSection =
            document.getElementById("route-compare-cost");

        if (compareSection) {
            compareSection.style.display = "block";
        }

    } else if (path.includes("hospitals")) {

        const hospitalSection =
            document.getElementById("route-hospitals");

        if (hospitalSection) {
            hospitalSection.style.display = "block";
        }

    } else {

        document
            .querySelectorAll("main > section")
            .forEach(function (section) {

                if (
                    section.id !== "route-hospitals" &&
                    section.id !== "route-compare-cost"
                ) {
                    section.style.display = "";
                }

            });
    }
}


window.addEventListener(
    "hashchange",
    handleRoute
);


/* =========================================
   TREATMENTS PAGE
========================================= */


/* -----------------------------------------
   FILTER TREATMENTS
----------------------------------------- */

function filterTreatments() {

    const input =
        document.getElementById("treatmentSearch");

    const popularSection =
        document.querySelector(".treatment-list-section");

    const noResults =
        document.getElementById("noTreatments");

    if (!input || !popularSection) return;

    const search =
        input.value.trim().toLowerCase();

    const cards =
        popularSection.querySelectorAll(
            ".full-treatment-card"
        );

    let found = 0;

    cards.forEach(function (card) {

        const name =
            (card.dataset.name || "").toLowerCase();

        const specialty =
            (card.dataset.specialty || "").toLowerCase();

        if (
            search === "" ||
            name.includes(search) ||
            specialty.includes(search)
        ) {

            card.style.display = "flex";
            found++;

        } else {

            card.style.display = "none";

        }
    });


    if (noResults) {

        if (found === 0 && search !== "") {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }
    }
}



function searchTreatmentButton() {

    const popularSection =
        document.querySelector(".treatment-list-section");

    if (!popularSection) return;

    /*
       First filter the treatments
    */
    filterTreatments();

    /*
       Then show the section
    */
    popularSection.style.display = "block";

    /*
       ONLY NOW scroll down
    */
    popularSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}



/* -----------------------------------------
   SPECIALTY FILTER
----------------------------------------- */

function selectSpecialty(specialty) {

    const input =
        document.getElementById("treatmentSearch");


    if (!input) return;


    input.value = specialty;


    filterTreatments();


    const section =
        document.querySelector(
            ".treatment-list-section"
        );


    if (section) {

        window.scrollTo({

            top: section.offsetTop - 80,

            behavior: "smooth"

        });
    }
}


/* -----------------------------------------
   SORT TREATMENTS
----------------------------------------- */

function sortTreatments() {

    const grid =
        document.getElementById("treatmentGrid");

    const sortSelect =
        document.getElementById("sortTreatments");


    if (!grid || !sortSelect) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".full-treatment-card"
            )
        );


    const sortValue =
        sortSelect.value;


    /* Price: Low → High */

    if (sortValue === "price-low") {

        cards.sort(function (a, b) {

            return (
                Number(a.dataset.price || 0) -
                Number(b.dataset.price || 0)
            );

        });
    }


    /* Price: High → Low */

    else if (sortValue === "price-high") {

        cards.sort(function (a, b) {

            return (
                Number(b.dataset.price || 0) -
                Number(a.dataset.price || 0)
            );

        });
    }


    /* Most Popular / Default */

    else {

        cards.sort(function (a, b) {

            return (
                Number(a.dataset.originalOrder || 0) -
                Number(b.dataset.originalOrder || 0)
            );

        });
    }


    cards.forEach(function (card) {

        grid.appendChild(card);

    });


    /*
       Re-apply search after sorting.
       This keeps hidden cards hidden.
    */

    filterTreatments();
}


/* -----------------------------------------
   INITIALIZE TREATMENT SORTING
----------------------------------------- */

function initializeTreatmentSorting() {

    const grid =
        document.getElementById("treatmentGrid");


    if (!grid) return;


    const cards =
        grid.querySelectorAll(
            ".full-treatment-card"
        );


    /*
       Remember the original order.
       This lets us restore the original
       order when "Most Popular" is selected.
    */

    cards.forEach(function (card, index) {

        card.dataset.originalOrder = index;

    });


    const sortSelect =
        document.getElementById("sortTreatments");


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            sortTreatments
        );

    }
}


/* -----------------------------------------
   LIVE SEARCH
----------------------------------------- */

function initializeTreatmentSearchEvents() {

    const input =
        document.getElementById("treatmentSearch");


    if (!input) return;


    /*
       Search while typing
    */

    input.addEventListener(
        "input",
        function () {

            filterTreatments();

        }
    );


    /*
       Also support Enter key
    */

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchTreatmentButton();

            }

        }
    );
}


/* -----------------------------------------
   CLEAR SEARCH
----------------------------------------- */

function clearTreatmentSearch() {

    const input =
        document.getElementById("treatmentSearch");


    if (!input) return;


    input.value = "";


    filterTreatments();


    /*
       Remove ?search= from URL
       without reloading the page.
    */

    const url =
        new URL(window.location.href);


    url.searchParams.delete("search");


    window.history.replaceState(
        {},
        "",
        url.pathname
    );
}


/* =========================================
   TREATMENT DATABASE
   -----------------------------------------
   Keep this for treatment-details.html
   for now.

   Later the backend API will replace this.
========================================= */

const treatmentDatabase = {

    "Heart Bypass Surgery": {

        category: "CARDIOLOGY",

        title: "Heart Bypass Surgery",

        description:
            "Surgical treatment to improve blood flow to the heart.",

        icon: "❤️",

        cost: "₹2.5L – ₹4.5L",

        stay: "5–8 days",

        recovery: "4–6 weeks",

        overviewTitle:
            "What is Heart Bypass Surgery?",

        overviewText1:
            "Heart bypass surgery (CABG) replaces damaged or blocked arteries in your heart with blood vessels from another area of your body to restore proper blood flow.",

        overviewText2:
            "It may be recommended when severe coronary artery disease causes persistent chest pain or increases the risk of a heart attack.",

        procedureType: "Surgical",

        faq1:
            "How much does heart bypass surgery cost in India?",

        faq2:
            "How long does recovery take?"
    },


    "Knee Replacement": {

        category: "ORTHOPEDICS",

        title: "Knee Replacement",

        description:
            "Replacement of a damaged knee joint with an artificial implant.",

        icon: "🦴",

        cost: "₹1.5L – ₹3.5L",

        stay: "3–5 days",

        recovery: "6–12 weeks",

        overviewTitle:
            "What is knee replacement?",

        overviewText1:
            "Knee replacement surgery replaces damaged portions of the knee joint with artificial components. It may be recommended when severe joint damage causes persistent pain and limits everyday activities.",

        overviewText2:
            "The procedure is commonly considered for people with advanced arthritis or significant knee damage when other treatments have not provided enough relief.",

        procedureType: "Surgical",

        faq1:
            "How much does knee replacement cost in India?",

        faq2:
            "How long does recovery take?"
    },


    "IVF Treatment": {

        category: "FERTILITY",

        title: "IVF Treatment",

        description:
            "Assisted reproductive treatment to help achieve pregnancy.",

        icon: "🧬",

        cost: "₹1L – ₹2.5L",

        stay: "2–4 weeks (cycle)",

        recovery: "Variable",

        overviewTitle:
            "What is IVF Treatment?",

        overviewText1:
            "In vitro fertilization (IVF) is a complex series of procedures used to help with fertility or prevent genetic problems and assist with the conception of a child.",

        overviewText2:
            "During IVF, mature eggs are collected from ovaries and fertilized by sperm in a lab. Then the fertilized egg is transferred to a uterus.",

        procedureType:
            "Medical / Non-Surgical",

        faq1:
            "How much does IVF cost in India?",

        faq2:
            "What is the success rate?"
    },


    "Dental Implants": {

        category: "DENTAL",

        title: "Dental Implants",

        description:
            "Permanent tooth replacement using modern dental implants.",

        icon: "🦷",

        cost: "₹60K – ₹1.5L",

        stay: "1–3 months",

        recovery: "1-2 weeks",

        overviewTitle:
            "What are Dental Implants?",

        overviewText1:
            "Dental implants are replacement tooth roots. Implants provide a strong foundation for fixed or removable replacement teeth that are made to match your natural teeth.",

        overviewText2:
            "They are commonly considered when you have one or more missing teeth, have a fully grown jawbone, and want a permanent solution instead of dentures.",

        procedureType:
            "Minor Surgical",

        faq1:
            "How much do dental implants cost in India?",

        faq2:
            "Are dental implants painful?"
    },


    "Brain Tumor Surgery": {

        category: "NEUROLOGY",

        title: "Brain Tumor Surgery",

        description:
            "Specialized neurosurgical treatment for selected brain tumors.",

        icon: "🧠",

        cost: "₹3L – ₹7L",

        stay: "7-14 days",

        recovery: "2-3 months",

        overviewTitle:
            "What is Brain Tumor Surgery?",

        overviewText1:
            "Brain tumor surgery (craniotomy) involves opening the skull to remove as much of the tumor as safely possible without damaging healthy brain tissue.",

        overviewText2:
            "This is often the first step in treating most benign and many malignant brain tumors, aiming to reduce pressure and provide a tissue sample for biopsy.",

        procedureType: "Surgical",

        faq1:
            "How much does brain tumor surgery cost in India?",

        faq2:
            "What are the risks of the surgery?"
    }

};


/* =========================================
   VIEW TREATMENT DETAILS
========================================= */

function viewTreatment(treatmentName) {

    window.location.href =
        "treatments-details.html?treatment=" +
        encodeURIComponent(treatmentName);
}


/* =========================================
   LOAD TREATMENT DETAILS
========================================= */

function loadTreatmentDetails() {

    if (!window.location.href.includes("treatments-details")) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const treatmentName = params.get("treatment");

    if (!treatmentName) return;

    fetch('http://localhost:5000/api/treatments')
        .then(res => res.json())
        .then(treatments => {
            const dbTreatment = treatments.find(t => t.name === treatmentName);
            const dbInfo = treatmentDatabase[treatmentName] || {};

            const title = dbTreatment ? dbTreatment.name : (dbInfo.title || treatmentName);
            const description = dbTreatment ? dbTreatment.description : (dbInfo.description || 'Detailed overview of the treatment.');
            const category = dbInfo.category || 'GENERAL';
            const cost = dbInfo.cost || 'Varies';
            const stay = dbInfo.stay || 'Varies';
            const recovery = dbInfo.recovery || 'Varies';
            const icon = dbInfo.icon || '\uD83C\uDFE5';
            const procedureType = dbInfo.procedureType || 'Medical Procedure';
            const overviewTitle = dbInfo.overviewTitle || ('What is ' + title + '?');
            const overviewText1 = dbInfo.overviewText1 || description;
            const overviewText2 = dbInfo.overviewText2 || 'Please consult with our specialists for a comprehensive understanding of the procedure.';
            const faq1 = dbInfo.faq1 || ('How much does ' + title + ' cost in India?');
            const faq2 = dbInfo.faq2 || 'What is the success rate?';

            var el;

            /* Breadcrumb */
            var breadcrumbs = document.querySelectorAll('.breadcrumb span');
            if (breadcrumbs.length > 2) breadcrumbs[2].textContent = title;

            /* Category */
            el = document.querySelector('.details-hero-content .category');
            if (el) el.textContent = category;

            /* Title */
            el = document.querySelector('.details-hero-content h1');
            if (el) el.textContent = title;

            /* Description */
            el = document.querySelector('.details-hero-content p');
            if (el) el.textContent = description;

            /* Hero Stats */
            var stats = document.querySelectorAll('.hero-stats div strong');
            if (stats.length >= 3) {
                stats[0].textContent = cost;
                stats[1].textContent = stay;
                stats[2].textContent = recovery;
            }

            /* Icon */
            el = document.querySelector('.details-hero-visual .big-treatment-icon');
            if (el) el.textContent = icon;

            /* Overview */
            el = document.querySelector('.details-section h2');
            if (el) el.textContent = overviewTitle;
            var overviewPs = document.querySelectorAll('.details-section p');
            if (overviewPs.length >= 2) {
                overviewPs[0].textContent = overviewText1;
                overviewPs[1].textContent = overviewText2;
            }

            /* Quick Facts */
            var facts = document.querySelectorAll('.facts-card .fact strong');
            if (facts.length >= 4) {
                facts[0].textContent = category.charAt(0) + category.slice(1).toLowerCase();
                facts[1].textContent = procedureType;
                facts[2].textContent = stay;
                facts[3].textContent = recovery;
            }

            /* FAQs */
            var faqs = document.querySelectorAll('.faq-list details summary');
            if (faqs.length >= 2) {
                faqs[0].textContent = faq1;
                faqs[1].textContent = faq2;
            }

            /* Store for compare button */
            if (dbTreatment) {
                window.currentTreatmentId = dbTreatment.id;
                window.currentTreatmentName = dbTreatment.name;
            }
        })
        .catch(function(err) { console.error('Error loading treatment details:', err); });
}


/* =========================================
   CONSULTATION / COMPARISON
========================================= */

function requestConsultation() {
    window.location.href = 'appointment.html';
}


function compareTreatment() {
    if (window.currentTreatmentId && window.currentTreatmentName) {
        window.location.href = 'hospitals_by_treatment.html?id=' + window.currentTreatmentId + '&name=' + encodeURIComponent(window.currentTreatmentName);
    } else {
        window.location.href = 'hospitals.html';
    }
}


/* =========================================
   INITIALIZE TREATMENTS PAGE
========================================= */

function initializeTreatmentsPage() {

    var grid = document.getElementById('treatmentGrid');
    if (!grid) return;

    fetch('http://localhost:5000/api/treatments')
        .then(function(res) { return res.json(); })
        .then(function(treatments) {
            if (!treatments || treatments.length === 0) {
                grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;">No treatments found.</div>';
                return;
            }

            var fallbackIcons = {
                'Angioplasty': '❤️',
                'ECG Test': '🩺',
                'Knee Replacement': '🦴',
                'Fracture Treatment': '🩹',
                'MRI Scan': '🩻',
                'Skin Allergy Treatment': '🧴',
                'Child Vaccination': '💉',
                'Appendectomy': '🔪',
                'Cataract Surgery': '👁️',
                'Hearing Test': '👂',
                'Normal Delivery': '👶',
                'Cesarean Section': '🍼',
                'Chemotherapy': '💊',
                'Cancer Screening': '🔬',
                'Spinal Surgery': '🦴',
                'Laser Eye Surgery': '👁️',
                'Tonsillectomy': '🗣️',
                'Physiotherapy': '🏃'
            };

            /* Populate specialty grid */
            var specialtyGrid = document.getElementById('specialtyGrid');
            if (specialtyGrid) {
                specialtyGrid.innerHTML = '';
                treatments.slice(0, 5).forEach(function(t) {
                    var dbInfo = treatmentDatabase[t.name] || {};
                    var icon = dbInfo.icon || fallbackIcons[t.name] || '\u{1F3E5}';
                    var btn = document.createElement('button');
                    btn.className = 'specialty-card';
                    btn.innerHTML = '<span class="specialty-icon">' + icon + '</span><strong>' + t.name + '</strong><small>' + (t.description || '') + '</small>';
                    btn.addEventListener('click', (function(name) { return function() { viewTreatment(name); }; })(t.name));
                    specialtyGrid.appendChild(btn);
                });
            }

            /* Populate treatment cards */
            grid.innerHTML = '';
            treatments.forEach(function(t) {
                var dbInfo = treatmentDatabase[t.name] || {};
                var category = dbInfo.category || 'GENERAL';
                var specialty = dbInfo.category ? (dbInfo.category.charAt(0) + dbInfo.category.slice(1).toLowerCase()) : 'General';
                var price = dbInfo.cost ? (parseInt(dbInfo.cost.replace(/[^0-9]/g, '')) * 1000 || 100000) : 100000;
                var icon = dbInfo.icon || fallbackIcons[t.name] || '\u{1F3E5}';
                var costStr = dbInfo.cost || 'Varies';
                var stayStr = dbInfo.stay || 'Varies';
                var description = t.description || dbInfo.description || 'Medical treatment.';
                var iconClass = specialty.toLowerCase();

                var article = document.createElement('article');
                article.className = 'full-treatment-card';
                article.setAttribute('data-name', t.name);
                article.setAttribute('data-specialty', specialty);
                article.setAttribute('data-price', price);
                article.setAttribute('data-treatment-id', t.id);
                article.innerHTML =
                    '<div class="full-treatment-icon ' + iconClass + '">' + icon + '</div>' +
                    '<div class="full-treatment-content">' +
                    '<span class="category">' + category + '</span>' +
                    '<h3>' + t.name + '</h3>' +
                    '<p>' + description + '</p>' +
                    '<div class="treatment-details">' +
                    '<div><small>Estimated cost</small><strong>' + costStr + '</strong></div>' +
                    '<div><small>Typical duration</small><strong>' + stayStr + '</strong></div>' +
                    '</div>' +
                    '<div class="card-actions" style="display: flex; gap: 10px; margin-top: 15px;">' +
                    '<button class="details-btn" style="flex: 1;">View Treatment &#8594;</button>' +
                    '<button class="details-btn hospitals-btn" style="flex: 1;">View Hospitals</button>' +
                    '</div>' +
                    '</div>';
                article.querySelector('.details-btn').addEventListener('click', (function(name) { return function() { viewTreatment(name); }; })(t.name));
                article.querySelector('.hospitals-btn').addEventListener('click', (function(id, name) { return function() { window.location.href = 'hospitals_by_treatment.html?id=' + id + '&name=' + encodeURIComponent(name); }; })(t.id, t.name));
                grid.appendChild(article);
            });

            initializeTreatmentSorting();
            initializeTreatmentSearchEvents();
            initializeTreatmentsSearch();
        })
        .catch(function(err) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;color:red;">Failed to load. Is the server running?</div>';
            console.error(err);
        });
}


/* =========================================
   INITIALIZE URL SEARCH
========================================= */

function initializeTreatmentsSearch() {

    if (
        !window.location.href.includes(
            "treatments.html"
        )
    ) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const searchQuery =
        params.get("search");


    if (searchQuery) {

        const input =
            document.getElementById(
                "treatmentSearch"
            );


        if (input) {

            input.value =
                searchQuery;

            filterTreatments();

        }
    }
}


/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Homepage router
        */

        handleRoute();


        /*
           Treatments page
        */

        initializeTreatmentsPage();


        /*
           Treatment details page
        */

        loadTreatmentDetails();

    }
);
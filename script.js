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

    if (
        !window.location.href.includes(
            "treatments-details"
        )
    ) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const treatmentName =
        params.get("treatment");


    if (
        treatmentName &&
        treatmentDatabase[treatmentName]
    ) {

        const data =
            treatmentDatabase[treatmentName];


        /* Breadcrumb */

        const breadcrumbTitle =
            document.querySelectorAll(
                ".breadcrumb span"
            );


        if (breadcrumbTitle.length > 2) {

            breadcrumbTitle[2].textContent =
                data.title;

        }


        /* Category */

        const categorySpan =
            document.querySelector(
                ".details-hero-content .category"
            );


        if (categorySpan) {

            categorySpan.textContent =
                data.category;

        }


        /* Title */

        const titleH1 =
            document.querySelector(
                ".details-hero-content h1"
            );


        if (titleH1) {

            titleH1.textContent =
                data.title;

        }


        /* Description */

        const descP =
            document.querySelector(
                ".details-hero-content p"
            );


        if (descP) {

            descP.textContent =
                data.description;

        }


        /* Hero Stats */

        const statStrong =
            document.querySelectorAll(
                ".hero-stats div strong"
            );


        if (statStrong.length >= 3) {

            statStrong[0].textContent =
                data.cost;

            statStrong[1].textContent =
                data.stay;

            statStrong[2].textContent =
                data.recovery;
        }


        /* Treatment Icon */

        const iconDiv =
            document.querySelector(
                ".details-hero-visual .big-treatment-icon"
            );


        if (iconDiv) {

            iconDiv.textContent =
                data.icon;

        }


        /* Overview */

        const overviewH2 =
            document.querySelector(
                ".details-main .details-section:nth-of-type(1) h2"
            );


        if (overviewH2) {

            overviewH2.textContent =
                data.overviewTitle;

        }


        const overviewP =
            document.querySelectorAll(
                ".details-main .details-section:nth-of-type(1) p"
            );


        if (overviewP.length >= 2) {

            overviewP[0].textContent =
                data.overviewText1;

            overviewP[1].textContent =
                data.overviewText2;

        }


        /* Quick Facts */

        const facts =
            document.querySelectorAll(
                ".facts-card .fact strong"
            );


        if (facts.length >= 4) {

            facts[0].textContent =
                data.category
                    .charAt(0) +
                data.category
                    .slice(1)
                    .toLowerCase();

            facts[1].textContent =
                data.procedureType;

            facts[2].textContent =
                data.stay;

            facts[3].textContent =
                data.recovery;
        }


        /* FAQs */

        const faqSummaries =
            document.querySelectorAll(
                ".faq-list details summary"
            );


        if (faqSummaries.length >= 2) {

            faqSummaries[0].textContent =
                data.faq1;

            faqSummaries[1].textContent =
                data.faq2;

        }
    }
}


/* =========================================
   CONSULTATION / COMPARISON
========================================= */

function requestConsultation() {

    alert(
        "Consultation request feature coming next!"
    );
}


function compareTreatment() {

    alert(
        "Hospital comparison feature coming next!"
    );
}


/* =========================================
   INITIALIZE TREATMENTS PAGE
========================================= */

function initializeTreatmentsPage() {

    /*
       This runs only when the treatment
       page elements actually exist.
    */

    const grid =
        document.getElementById("treatmentGrid");


    if (!grid) return;


    /*
       Remember original card order
    */

    initializeTreatmentSorting();


    /*
       Enable live search
    */

    initializeTreatmentSearchEvents();


    /*
       Check if homepage sent
       ?search=something
    */

    initializeTreatmentsSearch();

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
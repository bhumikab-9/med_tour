function performSearch() {

    const input = document.getElementById("mainSearch");
    const city = document.getElementById("citySelect");

    const searchValue = input.value.trim();

    if (searchValue === "") {
        input.focus();

        input.placeholder = "Try searching for a treatment...";
        return;
    }

    const selectedCity = city.value;

    console.log("Search:", searchValue);
    console.log("City:", selectedCity);

    /*
        For now this is a frontend demo.

        Later we'll connect this to:
        - treatment database
        - hospital database
        - doctor database
        - AI assistant
    */

    alert(
        "Searching for: " +
        searchValue +
        "\nLocation: " +
        selectedCity
    );
}


function quickSearch(value) {

    const input = document.getElementById("mainSearch");

    input.value = value;

    input.focus();
}

// --- SPA ROUTER ---

function navigate(e, path) {
    e.preventDefault();
    // Using hash routing prevents SecurityErrors when opening index.html directly from a folder
    window.location.hash = path;
    handleRoute();
}

function handleRoute() {
    // Check the hash instead of the pathname
    const path = window.location.hash;
    
    // Hide all main sections by default when routing
    document.querySelectorAll("main > section").forEach(sec => sec.style.display = "none");
    
    // Show specific section based on the URL path
    if (path.includes("compare-cost")) {
        document.getElementById("route-compare-cost").style.display = "block";
    } else if (path.includes("hospitals")) {
        document.getElementById("route-hospitals").style.display = "block";
    } else {
        // Default (Home page): show all sections EXCEPT the simple route pages
        document.querySelectorAll("main > section").forEach(sec => {
            if (sec.id !== "route-hospitals" && sec.id !== "route-compare-cost") {
                sec.style.display = "";
            }
        });
    }
}

// Listen for browser back/forward buttons
window.addEventListener("hashchange", handleRoute);

// Run router on initial load
document.addEventListener("DOMContentLoaded", handleRoute);
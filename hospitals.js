const state = {
    page: 1,
    limit: 6
};

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", async () => {
    bindEvents();
    await Promise.all([loadFilters(), loadHospitals()]);
});

function bindEvents() {
    $("searchHospitals").addEventListener("click", () => {
        state.page = 1;
        loadHospitals();
    });

    $("hospitalSearch").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            state.page = 1;
            loadHospitals();
        }
    });

    ["cityFilter", "specialityFilter", "sortFilter"].forEach((id) => {
        $(id).addEventListener("change", () => {
            state.page = 1;
            loadHospitals();
        });
    });
}

async function loadFilters() {
    try {
        const response = await fetch("/api/hospitals/filters");
        if (!response.ok) throw new Error("Could not load filters");

        const data = await response.json();

        $("cityFilter").insertAdjacentHTML(
            "beforeend",
            data.cities.map(city =>
                `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`
            ).join("")
        );

        $("specialityFilter").insertAdjacentHTML(
            "beforeend",
            data.specialities.map(item =>
                `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`
            ).join("")
        );
    } catch (error) {
        console.error(error);
    }
}

async function loadHospitals() {
    const grid = $("hospitalGrid");
    grid.innerHTML = `<div class="hospital-loading">Loading hospitals from database...</div>`;

    const params = new URLSearchParams({
        page: state.page,
        limit: state.limit,
        search: $("hospitalSearch").value.trim(),
        city: $("cityFilter").value,
        speciality: $("specialityFilter").value,
        sort: $("sortFilter").value
    });

    try {
        const response = await fetch(`/api/hospitals?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load hospitals");
        }

        $("resultsCount").innerHTML =
            `<strong>${data.total}</strong> hospital${data.total === 1 ? "" : "s"} found`;

        if (!data.hospitals.length) {
            grid.innerHTML = `
                <div class="hospital-empty">
                    <div class="empty-icon">⌕</div>
                    <h2>No hospitals found</h2>
                    <p>Try another hospital name, city or speciality.</p>
                </div>
            `;
            $("pagination").innerHTML = "";
            return;
        }

        grid.innerHTML = data.hospitals.map(renderHospital).join("");
        renderPagination(data.totalPages);
    } catch (error) {
        console.error(error);
        $("resultsCount").textContent = "Unable to load hospitals";
        grid.innerHTML = `
            <div class="hospital-error">
                <strong>Could not connect to the hospital database.</strong>
                <p style="margin-top:6px">
                    Make sure the Node.js API is running and MySQL credentials in
                    <code>.env</code> are correct.
                </p>
            </div>
        `;
        $("pagination").innerHTML = "";
    }
}

function renderHospital(hospital) {
    const rating = hospital.rating ? Number(hospital.rating).toFixed(1) : "New";
    const reviewCount = Number(hospital.review_count || 0);
    const startingCost = hospital.starting_cost
        ? formatCurrency(hospital.starting_cost)
        : "Contact hospital";

    const specialties = (hospital.specialities || [])
        .slice(0, 4)
        .map(item => `<span class="db-speciality-tag">${escapeHtml(item)}</span>`)
        .join("");

    return `
        <article class="db-hospital-card">
            <div class="db-hospital-image">
                <span class="db-hospital-location">📍 ${escapeHtml(hospital.city_state || "India")}</span>
            </div>

            <div class="db-hospital-body">
                <div class="db-hospital-title-row">
                    <h2>${escapeHtml(hospital.name)}</h2>
                    <span class="db-verified" title="Database provider">✓</span>
                </div>

                <p class="db-hospital-address">
                    ${escapeHtml(hospital.address || "")}
                    ${hospital.pincode ? `, ${escapeHtml(hospital.pincode)}` : ""}
                </p>

                <div class="db-hospital-stats">
                    <span class="db-rating">⭐ ${rating}</span>
                    <span class="db-review-count">${reviewCount} review${reviewCount === 1 ? "" : "s"}</span>
                    <span class="db-review-count">• Est. ${hospital.established_year || "—"}</span>
                </div>

                <div class="db-specialities">
                    ${specialties || `<span class="db-review-count">Specialities available on request</span>`}
                </div>

                <div class="db-hospital-footer">
                    <div class="db-starting-cost">
                        Starting treatment
                        <strong>${startingCost}</strong>
                    </div>
                    <button class="db-view-button"
                            onclick="viewHospital(${Number(hospital.id)})">
                        View Hospital →
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderPagination(totalPages) {
    const pagination = $("pagination");
    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    let html = "";

    for (let page = 1; page <= totalPages; page++) {
        html += `
            <button class="hospital-page-btn ${page === state.page ? "active" : ""}"
                    onclick="goToPage(${page})">
                ${page}
            </button>
        `;
    }

    pagination.innerHTML = html;
}

function goToPage(page) {
    state.page = page;
    loadHospitals();
    window.scrollTo({ top: 420, behavior: "smooth" });
}

function viewHospital(id) {
    // Ready for the future hospital-details route.
    window.location.href = `hospital-details.html?id=${encodeURIComponent(id)}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(value));
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

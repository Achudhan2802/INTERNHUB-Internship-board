const API_URL = "http://localhost:5000";
const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const domainSelect = document.getElementById("domainSelect");
const modeSelect = document.getElementById("modeSelect");
const clearButton = document.getElementById("clearButton");
const retryButton = document.getElementById("retryButton");

const internshipList = document.getElementById("internshipList");
const resultCount = document.getElementById("resultCount");

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");
const pagination = document.getElementById("pagination");

let currentPage = 1;
const limit = 6;

let currentFilters = {
    search: "",
    domain: "",
    mode: ""
};


// ==========================================
// LOAD INTERNSHIPS
// ==========================================

async function loadInternships(page = 1) {

    currentPage = page;

    showLoading();

    const params = new URLSearchParams({
        search: currentFilters.search,
        domain: currentFilters.domain,
        mode: currentFilters.mode,
        page: currentPage,
        limit: limit
    });

    try {

        const response = await fetch(
    `${API_URL}/api/internships?${params.toString()}`
)        
 

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                result.data?.message ||
                "Unable to load internships."
            );
        }

        const internships = Array.isArray(result.data)
            ? result.data
            : [];

        const meta = result.meta || {
            total: internships.length,
            totalPages: 1
        };

        hideAllStates();

        resultCount.textContent =
            `${meta.total} internship${meta.total === 1 ? "" : "s"} found`;

        if (internships.length === 0) {

            emptyState.hidden = false;
            pagination.innerHTML = "";

            return;
        }

        renderInternships(internships);
        renderPagination(meta);

    } catch (error) {

        console.error(
            "Load internships error:",
            error
        );

        showError(
            error.message ||
            "Unable to load internships."
        );
    }
}


// ==========================================
// RENDER INTERNSHIPS
// ==========================================

function renderInternships(internships) {

    internshipList.innerHTML = internships
        .map(createInternshipCard)
        .join("");
}


// ==========================================
// CREATE INTERNSHIP CARD
// ==========================================

function createInternshipCard(internship) {

    /*
     * IMPORTANT:
     * The backend database uses integer IDs:
     * 1, 2, 3, etc.
     *
     * Example:
     * internship.id = 1
     *
     * Therefore the links will become:
     * details.html?id=1
     * apply.html?id=1
     */

    const internshipId = Number(internship.id);

    if (!Number.isInteger(internshipId)) {

        console.error(
            "Invalid internship ID:",
            internship.id
        );

        return "";
    }

    const skills = Array.isArray(internship.skills)
        ? internship.skills
        : [];

    const internshipType =
        internship.type ||
        internship.mode ||
        "Internship";

    const company =
        internship.company ||
        "Company";

    const location =
        internship.location ||
        "Not specified";

    const openings =
        Number(internship.openings || 1);


    return `
        <article class="internship-card">

            <div class="card-icon">
                💼
            </div>

            <span class="mode-badge">
                ${escapeHTML(internshipType)}
            </span>

            <h3>
                ${escapeHTML(
                    internship.title || "Internship"
                )}
            </h3>

            <p class="card-domain">
                ${escapeHTML(company)}
            </p>

            <p class="card-info">

                📍 ${escapeHTML(location)}

                <br>

                👥 ${openings}
                opening${openings === 1 ? "" : "s"}

            </p>

            <div class="skills">

                ${skills
                    .map(skill => `
                        <span class="skill">
                            ${escapeHTML(skill)}
                        </span>
                    `)
                    .join("")}

            </div>

            <div class="card-actions">

                <a
                    class="btn btn-secondary"
                    href="details.html?id=${encodeURIComponent(internshipId)}"
                >
                    Details
                </a>

                <a
                    class="btn btn-primary"
                    href="apply.html?id=${encodeURIComponent(internshipId)}"
                >
                    Apply
                </a>

            </div>

        </article>
    `;
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// PAGINATION
// ==========================================

function renderPagination(meta) {

    pagination.innerHTML = "";

    if (
        !meta.totalPages ||
        meta.totalPages <= 1
    ) {
        return;
    }


    // Previous button

    if (currentPage > 1) {

        pagination.innerHTML += `
            <button
                type="button"
                class="page-button"
                data-page="${currentPage - 1}"
            >
                ←
            </button>
        `;
    }


    // Page numbers

    for (
        let page = 1;
        page <= meta.totalPages;
        page++
    ) {

        pagination.innerHTML += `
            <button
                type="button"
                class="page-button ${
                    page === currentPage
                        ? "active"
                        : ""
                }"
                data-page="${page}"
            >
                ${page}
            </button>
        `;
    }


    // Next button

    if (
        currentPage <
        meta.totalPages
    ) {

        pagination.innerHTML += `
            <button
                type="button"
                class="page-button"
                data-page="${currentPage + 1}"
            >
                →
            </button>
        `;
    }


    // Pagination events

    pagination
        .querySelectorAll(".page-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page = Number(
                        button.dataset.page
                    );

                    loadInternships(page);

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );

        });
}


// ==========================================
// FILTER FORM
// ==========================================

if (filterForm) {

    filterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            currentFilters.search =
                searchInput.value.trim();

            currentFilters.domain =
                domainSelect.value;

            currentFilters.mode =
                modeSelect.value;

            loadInternships(1);
        }
    );
}


// ==========================================
// CLEAR FILTERS
// ==========================================

if (clearButton) {

    clearButton.addEventListener(
        "click",
        () => {

            searchInput.value = "";
            domainSelect.value = "";
            modeSelect.value = "";

            currentFilters = {
                search: "",
                domain: "",
                mode: ""
            };

            loadInternships(1);
        }
    );
}


// ==========================================
// RETRY
// ==========================================

if (retryButton) {

    retryButton.addEventListener(
        "click",
        () => {

            loadInternships(currentPage);
        }
    );
}


// ==========================================
// UI STATES
// ==========================================

function showLoading() {

    internshipList.innerHTML = "";
    pagination.innerHTML = "";

    loadingState.hidden = false;
    errorState.hidden = true;
    emptyState.hidden = true;
}


function hideAllStates() {

    loadingState.hidden = true;
    errorState.hidden = true;
    emptyState.hidden = true;
}


function showError(message) {

    internshipList.innerHTML = "";
    pagination.innerHTML = "";

    loadingState.hidden = true;
    emptyState.hidden = true;
    errorState.hidden = false;

    errorMessage.textContent = message;
}


// ==========================================
// START
// ==========================================

loadInternships();
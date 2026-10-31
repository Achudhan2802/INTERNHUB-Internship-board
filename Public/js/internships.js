const filterForm =
    document.getElementById("filterForm");

const searchInput =
    document.getElementById("searchInput");

const domainSelect =
    document.getElementById("domainSelect");

const modeSelect =
    document.getElementById("modeSelect");

const clearButton =
    document.getElementById("clearButton");

const retryButton =
    document.getElementById("retryButton");

const internshipList =
    document.getElementById("internshipList");

const resultCount =
    document.getElementById("resultCount");

const loadingState =
    document.getElementById("loadingState");

const errorState =
    document.getElementById("errorState");

const errorMessage =
    document.getElementById("errorMessage");

const emptyState =
    document.getElementById("emptyState");

const pagination =
    document.getElementById("pagination");


let currentPage = 1;

const limit = 6;


let currentFilters = {

    search: "",

    domain: "",

    mode: ""

};



async function loadInternships(page = 1) {

    currentPage = page;


    showLoading();


    const params =
        new URLSearchParams({

            search:
                currentFilters.search,

            domain:
                currentFilters.domain,

            mode:
                currentFilters.mode,

            page:
                currentPage,

            limit:
                limit

        });


    try {

        const response =
            await fetch(
                `/api/internships?${params}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.data?.message ||
                "Unable to load internships."
            );

        }


        const internships =
            result.data;


        const meta =
            result.meta;


        hideAllStates();


        resultCount.textContent =
            `${meta.total} internship${meta.total === 1 ? "" : "s"} found`;


        if (internships.length === 0) {

            emptyState.hidden = false;

            pagination.innerHTML = "";

            return;
        }


        renderInternships(
            internships
        );


        renderPagination(
            meta
        );


    } catch (error) {

        showError(
            error.message
        );

    }

}



function renderInternships(
    internships
) {

    internshipList.innerHTML =
        internships
            .map(
                createInternshipCard
            )
            .join("");

}



function createInternshipCard(
    internship
) {

    return `

        <article
            class="internship-card">


            <div class="card-icon">
                💼
            </div>


            <span class="mode-badge">
                ${internship.mode}
            </span>


            <h3>
                ${internship.title}
            </h3>


            <p class="card-domain">
                ${internship.domain}
            </p>


            <p class="card-info">

                📍 ${internship.location}

                <br>

                👥 ${internship.openings}
                opening${internship.openings > 1 ? "s" : ""}

            </p>


            <div class="skills">

                ${internship.skills
                    .map(
                        skill =>
                            `<span class="skill">
                                ${skill}
                            </span>`
                    )
                    .join("")}

            </div>


            <div class="card-actions">


                <a
                    class="btn btn-secondary"
                    href="details.html?id=${internship.id}">

                    Details

                </a>


                <a
                    class="btn btn-primary"
                    href="apply.html?id=${internship.id}">

                    Apply

                </a>


            </div>


        </article>

    `;

}



function renderPagination(meta) {

    pagination.innerHTML = "";


    if (meta.totalPages <= 1) {

        return;
    }


    // Previous button

    if (currentPage > 1) {

        pagination.innerHTML += `

            <button
                class="page-button"
                data-page="${currentPage - 1}">

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
                class="page-button ${
                    page === currentPage
                        ? "active"
                        : ""
                }"
                data-page="${page}">

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
                class="page-button"
                data-page="${currentPage + 1}">

                →

            </button>

        `;
    }


    pagination
        .querySelectorAll(
            ".page-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        Number(
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



retryButton.addEventListener(
    "click",
    () => {

        loadInternships(
            currentPage
        );

    }
);



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

    errorMessage.textContent =
        message;

}



loadInternships();
const loadingState =
    document.getElementById("loadingState");

const errorState =
    document.getElementById("errorState");

const errorMessage =
    document.getElementById("errorMessage");

const retryButton =
    document.getElementById("retryButton");

const emptyState =
    document.getElementById("emptyState");

const applicationsContent =
    document.getElementById("applicationsContent");

const applicationsList =
    document.getElementById("applicationsList");

const applicationCount =
    document.getElementById("applicationCount");


// =====================================================
// LOAD APPLICATIONS
// =====================================================

async function loadApplications() {

    showLoading();

    try {

        const response =
            await fetch("/api/applications");


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.data?.message ||
                "Unable to load applications."
            );
        }


        const applications =
            result.data || [];


        if (applications.length === 0) {

            showEmpty();

            return;
        }


        displayApplications(applications);


    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Unable to load applications."
        );
    }
}


// =====================================================
// DISPLAY APPLICATIONS
// =====================================================

function displayApplications(applications) {

    applicationsList.innerHTML = "";


    applicationCount.textContent =
        `${applications.length} application${
            applications.length === 1
                ? ""
                : "s"
        }`;


    applications.forEach(application => {

        const card =
            createApplicationCard(application);

        applicationsList.appendChild(card);

    });


    loadingState.hidden = true;

    errorState.hidden = true;

    emptyState.hidden = true;

    applicationsContent.hidden = false;
}


// =====================================================
// CREATE APPLICATION CARD
// =====================================================

function createApplicationCard(application) {

    const card =
        document.createElement("article");

    card.className =
        "application-history-card";


    const date =
        formatDate(application.createdAt);


    card.innerHTML = `

        <div class="application-card-header">

            <div>

                <span class="application-status">
                    Submitted
                </span>

               <h3>
    ${escapeHTML(application.internshipTitle)}
</h3>

<p class="application-domain">
    ${escapeHTML(application.internshipDomain)}
</p>

            </div>

            <span class="application-date">
                ${date}
            </span>

        </div>


        <div class="application-card-body">

            <div class="application-detail">

                <span class="detail-label">
                    Internship ID
                </span>

                <strong>
                    ${escapeHTML(application.internshipId)}
                </strong>

            </div>


            <div class="application-detail">

                <span class="detail-label">
                    Applicant
                </span>

                <strong>
                    ${escapeHTML(application.name)}
                </strong>

            </div>


            <div class="application-detail">

    <span class="detail-label">
        Internship ID
    </span>

    <strong>
        ${escapeHTML(application.internshipId)}
    </strong>

</div>


            ${
                application.portfolio
                    ? `
                        <div class="application-detail">

                            <span class="detail-label">
                                Portfolio
                            </span>

                            <a
                                href="${safeURL(application.portfolio)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Portfolio ↗
                            </a>

                        </div>
                    `
                    : ""
            }

        </div>

    `;


    return card;
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "Date unavailable";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {

        return "Date unavailable";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// SAFE URL
// =====================================================

function safeURL(value) {

    try {

        const url =
            new URL(value);


        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            return "#";
        }


        return url.href;

    } catch {

        return "#";
    }
}


// =====================================================
// LOADING STATE
// =====================================================

function showLoading() {

    loadingState.hidden = false;

    errorState.hidden = true;

    emptyState.hidden = true;

    applicationsContent.hidden = true;
}


// =====================================================
// EMPTY STATE
// =====================================================

function showEmpty() {

    loadingState.hidden = true;

    errorState.hidden = true;

    emptyState.hidden = false;

    applicationsContent.hidden = true;
}


// =====================================================
// ERROR STATE
// =====================================================

function showError(message) {

    loadingState.hidden = true;

    errorState.hidden = false;

    emptyState.hidden = true;

    applicationsContent.hidden = true;

    errorMessage.textContent = message;
}


// =====================================================
// RETRY
// =====================================================

retryButton.addEventListener(
    "click",
    loadApplications
);


// =====================================================
// START
// =====================================================

loadApplications();
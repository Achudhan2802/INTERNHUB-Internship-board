const API_URL = "http://localhost:5000";

const featuredContainer =
    document.getElementById("featuredInternships");

const internshipCount =
    document.getElementById("internshipCount");

const domainCount =
    document.getElementById("domainCount");

const openingCount =
    document.getElementById("openingCount");

const loadingState =
    document.getElementById("loadingState");


// Load internship data
async function loadHomeData() {

    if (loadingState) {
        loadingState.hidden = false;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/internships?limit=50`
        );

        if (!response.ok) {
            throw new Error("Unable to load internships.");
        }

        const result = await response.json();

        const internships =
            Array.isArray(result.data)
                ? result.data
                : [];


        // No internships
        if (internships.length === 0) {

            featuredContainer.innerHTML = `
                <p>No internships are currently available.</p>
            `;

            internshipCount.textContent = "0";
            domainCount.textContent = "0";
            openingCount.textContent = "0";

            return;
        }


        // Statistics
        internshipCount.textContent =
            internships.length;


        const domains = new Set(
            internships.map(function (internship) {

                return (
                    internship.domain ||
                    internship.type ||
                    "Internship"
                );

            })
        );


        domainCount.textContent =
            domains.size;


        openingCount.textContent =
            internships.length;


        // Show first 3 internships
        const featured =
            internships.slice(0, 3);


        featuredContainer.innerHTML =
            featured
                .map(createInternshipCard)
                .join("");


    } catch (error) {

        console.error(
            "Failed to load internships:",
            error
        );


        featuredContainer.innerHTML = `
            <div class="api-error">

                <p>
                    Unable to load internships.
                </p>

                <button
                    type="button"
                    onclick="loadHomeData()"
                >
                    Retry
                </button>

            </div>
        `;

    } finally {

        if (loadingState) {
            loadingState.hidden = true;
        }

    }
}


// Create internship card
function createInternshipCard(internship) {

    const skills =
        Array.isArray(internship.skills)
            ? internship.skills
            : [];


    /*
     * IMPORTANT
     *
     * PostgreSQL internship.id is an integer.
     *
     * Example:
     * id = 1
     * id = 2
     * id = 3
     *
     * We use this ID directly in the URL.
     */

    const internshipId =
        Number(internship.id);


    return `
        <article class="internship-card">

            <div class="card-icon">
                💼
            </div>


            <span class="mode-badge">
                ${escapeHTML(
                    internship.type ||
                    internship.mode ||
                    "Internship"
                )}
            </span>


            <h3>
                ${escapeHTML(
                    internship.title || ""
                )}
            </h3>


            <p class="card-domain">
                ${escapeHTML(
                    internship.company || ""
                )}
            </p>


            <p class="card-info">

                📍 ${escapeHTML(
                    internship.location || ""
                )}

                <br>

                💰 ₹${Number(
                    internship.stipend || 0
                ).toLocaleString("en-IN")}

                <br>

                ⏱️ ${escapeHTML(
                    internship.duration ||
                    "Not specified"
                )}

            </p>


            <div class="skills">

                ${skills
                    .map(function (skill) {

                        return `
                            <span class="skill">
                                ${escapeHTML(skill)}
                            </span>
                        `;

                    })
                    .join("")}

            </div>


            <div class="card-actions">

                <a
                    href="details.html?id=${encodeURIComponent(internshipId)}"
                    class="btn btn-secondary"
                >
                    View Details
                </a>


                <a
                    href="apply.html?id=${encodeURIComponent(internshipId)}"
                    class="btn btn-primary"
                >
                    Apply
                </a>

            </div>

        </article>
    `;
}


// Prevent HTML injection
function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// Start loading
loadHomeData();
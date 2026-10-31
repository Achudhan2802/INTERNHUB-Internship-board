const featuredContainer =
    document.getElementById("featuredInternships");

const internshipCount =
    document.getElementById("internshipCount");

const domainCount =
    document.getElementById("domainCount");

const openingCount =
    document.getElementById("openingCount");


async function loadHomeData() {

    try {

        const response =
            await fetch("/api/internships?limit=50");

        const result =
            await response.json();


        if (result.status !== "success") {

            throw new Error(
                "Unable to load internships."
            );

        }


        const internships =
            result.data;


        // ============================
        // STATISTICS
        // ============================

        internshipCount.textContent =
            internships.length;


        const domains =
            new Set(
                internships.map(
                    internship => internship.domain
                )
            );

        domainCount.textContent =
            domains.size;


        const openings =
            internships.reduce(
                (total, internship) =>
                    total + internship.openings,
                0
            );

        openingCount.textContent =
            openings;


        // ============================
        // FEATURED INTERNSHIPS
        // ============================

        const featured =
            internships.slice(0, 3);


        featuredContainer.innerHTML =
            featured
                .map(createInternshipCard)
                .join("");


    } catch (error) {

        console.error(error);

        featuredContainer.innerHTML = `
            <p>
                Unable to load internships.
                Please try again later.
            </p>
        `;
    }
}



function createInternshipCard(internship) {

    return `

        <article class="internship-card">


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
                            `<span class="skill">${skill}</span>`
                    )
                    .join("")}

            </div>


            <div class="card-actions">


                <a
                    href="details.html?id=${internship.id}"
                    class="btn btn-secondary">

                    View Details

                </a>


                <a
                    href="apply.html?id=${internship.id}"
                    class="btn btn-primary">

                    Apply

                </a>


            </div>


        </article>

    `;
}



loadHomeData();
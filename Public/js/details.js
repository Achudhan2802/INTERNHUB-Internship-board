const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");

const detailsContent = document.getElementById("detailsContent");

const detailsTitle = document.getElementById("detailsTitle");
const detailsDomain = document.getElementById("detailsDomain");

const detailsTitleMain = document.getElementById("detailsTitleMain");
const detailsMode = document.getElementById("detailsMode");
const detailsLocation = document.getElementById("detailsLocation");

const detailsDescription =
    document.getElementById("detailsDescription");

const detailsSkills =
    document.getElementById("detailsSkills");

const detailsRequirements =
    document.getElementById("detailsRequirements");

const overviewDomain =
    document.getElementById("overviewDomain");

const overviewMode =
    document.getElementById("overviewMode");

const overviewLocation =
    document.getElementById("overviewLocation");

const overviewOpenings =
    document.getElementById("overviewOpenings");

const applyButton =
    document.getElementById("applyButton");


// Get internship ID from URL
const params = new URLSearchParams(window.location.search);

const internshipId = params.get("id");


// Load internship details
async function loadInternshipDetails() {

    showLoading();

    if (!internshipId) {

        showError("No internship ID was provided.");

        return;
    }

    try {

        const response = await fetch(
            `/api/internships/${encodeURIComponent(internshipId)}`
        );

        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.data?.message ||
                "Internship could not be found."
            );
        }


        displayInternship(result.data);

    } catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Unable to load internship details."
        );
    }
}


// Display internship information
function displayInternship(internship) {

    // Page heading
    detailsTitle.textContent = internship.title;

    detailsDomain.textContent =
        `${internship.domain} • ${internship.mode}`;


    // Main details
    detailsTitleMain.textContent =
        internship.title;

    detailsMode.textContent =
        internship.mode;

    detailsLocation.textContent =
        `📍 ${internship.location}`;


    // Description
    detailsDescription.textContent =
        `Join our ${internship.domain} team as a ${internship.title}. 
        This internship gives students practical experience, 
        mentorship, and an opportunity to work on real-world projects.`;


    // Skills
    detailsSkills.innerHTML = "";

    internship.skills.forEach(skill => {

        const skillElement =
            document.createElement("span");

        skillElement.className = "skill-tag";

        skillElement.textContent = skill;

        detailsSkills.appendChild(skillElement);

    });


    // Requirements
    detailsRequirements.innerHTML = "";

    const requirements = [
        "Currently pursuing a degree or equivalent education.",
        "Basic understanding of the relevant technical concepts.",
        "Willingness to learn and work on real-world projects.",
        "Good communication and problem-solving skills."
    ];


    requirements.forEach(requirement => {

        const listItem =
            document.createElement("li");

        listItem.textContent = requirement;

        detailsRequirements.appendChild(listItem);

    });


    // Overview
    overviewDomain.textContent =
        internship.domain;

    overviewMode.textContent =
        internship.mode;

    overviewLocation.textContent =
        internship.location;

    overviewOpenings.textContent =
        `${internship.openings} position${
            internship.openings === 1 ? "" : "s"
        }`;


    // Apply button
    applyButton.href =
        `apply.html?id=${encodeURIComponent(internship.id)}`;


    // Show page
    loadingState.hidden = true;

    errorState.hidden = true;

    detailsContent.hidden = false;
}


// Loading state
function showLoading() {

    loadingState.hidden = false;

    errorState.hidden = true;

    detailsContent.hidden = true;
}


// Error state
function showError(message) {

    loadingState.hidden = true;

    detailsContent.hidden = true;

    errorState.hidden = false;

    errorMessage.textContent = message;
}


// Retry
retryButton.addEventListener(
    "click",
    loadInternshipDetails
);


// Start
loadInternshipDetails();
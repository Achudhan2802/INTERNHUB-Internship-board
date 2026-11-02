
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


// Backend API
const API_URL = "http://localhost:5000";


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

        // ID must be a number
        if (!/^\d+$/.test(internshipId)) {
            throw new Error("Invalid internship ID.");
        }

        const response = await fetch(
    `${API_URL}/api/internships?${params.toString()}`
)

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                result.data?.message ||
                "Internship could not be found."
            );
        }

        displayInternship(result.data);

    } catch (error) {

        console.error("Load internship error:", error);

        showError(
            error.message ||
            "Unable to load internship details."
        );
    }
}


// Display internship information
function displayInternship(internship) {

    detailsTitle.textContent =
        internship.title || "";

    detailsDomain.textContent =
        `${internship.domain || internship.type || "Internship"} • ${internship.mode || ""}`;


    detailsTitleMain.textContent =
        internship.title || "";

    detailsMode.textContent =
        internship.mode || internship.type || "Internship";

    detailsLocation.textContent =
        `📍 ${internship.location || "Not specified"}`;


    detailsDescription.textContent =
        `Join our ${internship.domain || internship.type || "internship"} team as a ${internship.title || "an intern"}.
        This internship gives students practical experience,
        mentorship, and an opportunity to work on real-world projects.`;


    // Skills
    detailsSkills.innerHTML = "";

    const skills = Array.isArray(internship.skills)
        ? internship.skills
        : [];

    skills.forEach(skill => {

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
        internship.domain || internship.type || "Internship";

    overviewMode.textContent =
        internship.mode || internship.type || "Not specified";

    overviewLocation.textContent =
        internship.location || "Not specified";

    const openings =
        Number(internship.openings || 1);

    overviewOpenings.textContent =
        `${openings} position${openings === 1 ? "" : "s"}`;


    // IMPORTANT:
    // Use PostgreSQL integer ID
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


if (retryButton) {
    retryButton.addEventListener("click", function () {
        loadInternshipDetails();
    });
}


// Start
loadInternshipDetails();
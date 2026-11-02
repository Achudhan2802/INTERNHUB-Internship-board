const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");
const applyContent = document.getElementById("applyContent");
const applicationForm = document.getElementById("applicationForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const portfolioInput = document.getElementById("portfolio");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const portfolioError = document.getElementById("portfolioError");

const submitButton = document.getElementById("submitButton");
const formError = document.getElementById("formError");

const successState = document.getElementById("successState");
const successMessage = document.getElementById("successMessage");

const internshipTitle = document.getElementById("internshipTitle");
const internshipDomain = document.getElementById("internshipDomain");
const internshipLocation = document.getElementById("internshipLocation");
const internshipMode = document.getElementById("internshipMode");
const internshipOpenings = document.getElementById("internshipOpenings");

const params = new URLSearchParams(window.location.search);
const internshipId = params.get("id");

let currentInternship = null;

const API_URL = "http://localhost:5000";


// =====================================================
// LOAD INTERNSHIP
// =====================================================

async function loadInternship() {

    showLoading();

    if (!internshipId) {
        showError("No internship ID was provided.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/internships/${encodeURIComponent(internshipId)}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Internship could not be found."
            );
        }

        currentInternship = result.data;

        displayInternship(currentInternship);

    } catch (error) {

        console.error("Load internship error:", error);

        showError(
            error.message || "Unable to load internship."
        );
    }
}


// =====================================================
// DISPLAY INTERNSHIP
// =====================================================

function displayInternship(internship) {

    internshipTitle.textContent =
        internship.title || "Internship";

    internshipDomain.textContent =
        internship.company || "Company";

    internshipLocation.textContent =
        internship.location || "Location";

    internshipMode.textContent =
        internship.type || "Internship";

    internshipOpenings.textContent =
        "Available";


    loadingState.hidden = true;
    errorState.hidden = true;
    applyContent.hidden = false;
}


// =====================================================
// FORM VALIDATION
// =====================================================

function validateForm() {

    let isValid = true;

    clearErrors();


    // NAME

    const name = nameInput.value.trim();

    if (!name) {

        showFieldError(
            nameError,
            "Please enter your name."
        );

        isValid = false;

    } else if (name.length < 2) {

        showFieldError(
            nameError,
            "Name must contain at least 2 characters."
        );

        isValid = false;

    } else if (name.length > 100) {

        showFieldError(
            nameError,
            "Name must not exceed 100 characters."
        );

        isValid = false;
    }


    // EMAIL

    const email = emailInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {

        showFieldError(
            emailError,
            "Please enter your email address."
        );

        isValid = false;

    } else if (!emailPattern.test(email)) {

        showFieldError(
            emailError,
            "Please enter a valid email address."
        );

        isValid = false;
    }


    // PORTFOLIO

    const portfolio =
        portfolioInput.value.trim();

    if (portfolio) {

        try {

            const url = new URL(portfolio);

            if (
                url.protocol !== "http:" &&
                url.protocol !== "https:"
            ) {
                throw new Error();
            }

        } catch {

            showFieldError(
                portfolioError,
                "Portfolio must be a valid HTTP or HTTPS URL."
            );

            isValid = false;
        }
    }


    return isValid;
}


// =====================================================
// SHOW FIELD ERROR
// =====================================================

function showFieldError(element, message) {

    element.textContent = message;
}


// =====================================================
// CLEAR ERRORS
// =====================================================

function clearErrors() {

    nameError.textContent = "";
    emailError.textContent = "";
    portfolioError.textContent = "";

    formError.hidden = true;
    formError.textContent = "";
}


// =====================================================
// SUBMIT APPLICATION
// =====================================================

applicationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        if (!currentInternship) {

            formError.textContent =
                "Internship information is not available.";

            formError.hidden = false;

            return;
        }


        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";


        try {

            const applicationData = {

                internship_id:
                    currentInternship.id,

                name:
                    nameInput.value.trim(),

                email:
                    emailInput.value.trim(),

                portfolio:
                    portfolioInput.value.trim()
            };


            const response = await fetch(
                `${API_URL}/api/applications`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(applicationData)
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Application could not be submitted."
                );
            }


            applicationForm.hidden = true;

            successState.hidden = false;

            successMessage.textContent =
                `Your application for ${currentInternship.title} has been submitted successfully.`;


        } catch (error) {

            console.error(
                "Application submission error:",
                error
            );

            formError.textContent =
                error.message ||
                "Something went wrong while submitting your application.";

            formError.hidden = false;

            submitButton.disabled = false;

            submitButton.textContent =
                "Submit Application →";
        }
    }
);


// =====================================================
// LOADING
// =====================================================

function showLoading() {

    loadingState.hidden = false;
    errorState.hidden = true;
    applyContent.hidden = true;
}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    loadingState.hidden = true;
    errorState.hidden = false;
    applyContent.hidden = true;

    errorMessage.textContent = message;
}


// =====================================================
// RETRY
// =====================================================

retryButton.addEventListener(
    "click",
    loadInternship
);


// =====================================================
// START
// =====================================================

loadInternship();
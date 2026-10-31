// =====================================================
// INTERNHUB COMMON JAVASCRIPT
// =====================================================


// Highlight the current page in the navbar
function highlightCurrentPage() {

    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";

    const navLinks =
        document.querySelectorAll(".nav-links a");


    navLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

            link.setAttribute(
                "aria-current",
                "page"
            );

        }

    });
}


// Add a small screen-reader-friendly page title
function updatePageTitle() {

    const path =
        window.location.pathname;

    if (
        path.endsWith("internships.html")
    ) {

        document.title =
            "Explore Internships | InternHub";

    }

    else if (
        path.endsWith("applications.html")
    ) {

        document.title =
            "My Applications | InternHub";

    }

    else if (
        path.endsWith("about.html")
    ) {

        document.title =
            "About | InternHub";

    }

    else if (
        path.endsWith("apply.html")
    ) {

        document.title =
            "Apply | InternHub";

    }

    else if (
        path.endsWith("details.html")
    ) {

        document.title =
            "Internship Details | InternHub";

    }

}


// Run shared functions
highlightCurrentPage();
updatePageTitle();
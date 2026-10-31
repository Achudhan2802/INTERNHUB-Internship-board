const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

// ===============================
// FILE PATHS
// ===============================

const internshipsFile = path.join(
    __dirname,
    "data",
    "internships.json"
);

const applicationsFile = path.join(
    __dirname,
    "data",
    "applications.json"
);


// ===============================
// MIDDLEWARE
// ===============================

// Allows Express to understand JSON request bodies
app.use(express.json());

// Makes files inside "public" available in the browser
app.use(express.static(path.join(__dirname, "public")));


// ===============================
// HELPER FUNCTIONS
// ===============================

function readJSON(filePath) {
    const file = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file);
}

function writeJSON(filePath, data) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2)
    );
}

function createResponse(status, data, meta = {}) {
    return {
        status,
        data,
        meta
    };
}


// ===============================
// GET ALL INTERNSHIPS
// ===============================

app.get("/api/internships", (req, res) => {

    try {

        const database = readJSON(internshipsFile);

        let internships = database.internships;

        // Search
        const search = (req.query.search || "")
            .trim()
            .toLowerCase();

        // Domain filter
        const domain = (req.query.domain || "")
            .trim()
            .toLowerCase();

        // Work mode filter
        const mode = (req.query.mode || "")
            .trim()
            .toLowerCase();


        // ===============================
        // SEARCH FILTER
        // ===============================

        if (search) {

            internships = internships.filter((internship) => {

                const searchableText = [

                    internship.title,
                    internship.domain,
                    internship.location,
                    internship.mode,
                    ...internship.skills

                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(search);
            });
        }


        // ===============================
        // DOMAIN FILTER
        // ===============================

        if (domain) {

            internships = internships.filter(
                (internship) =>
                    internship.domain.toLowerCase() === domain
            );
        }


        // ===============================
        // MODE FILTER
        // ===============================

        if (mode) {

            internships = internships.filter(
                (internship) =>
                    internship.mode.toLowerCase() === mode
            );
        }


        // ===============================
        // PAGINATION
        // ===============================

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 6, 1),
            50
        );

        const total = internships.length;

        const totalPages = Math.max(
            Math.ceil(total / limit),
            1
        );

        const start = (page - 1) * limit;

        const results = internships.slice(
            start,
            start + limit
        );


        res.json(
            createResponse(
                "success",
                results,
                {
                    page,
                    limit,
                    total,
                    totalPages
                }
            )
        );

    } catch (error) {

        console.error(
            "Failed to load internships:",
            error.message
        );

        res.status(500).json(
            createResponse(
                "error",
                {
                    message: "Unable to load internships."
                }
            )
        );
    }
});


// ===============================
// GET ONE INTERNSHIP
// ===============================

app.get("/api/internships/:id", (req, res) => {

    try {

        const database = readJSON(internshipsFile);

        const internship = database.internships.find(
            (item) => item.id === req.params.id
        );


        if (!internship) {

            return res.status(404).json(
                createResponse(
                    "error",
                    {
                        message: "Internship not found."
                    }
                )
            );
        }


        res.json(
            createResponse(
                "success",
                internship
            )
        );

    } catch (error) {

        console.error(
            "Failed to load internship:",
            error.message
        );

        res.status(500).json(
            createResponse(
                "error",
                {
                    message: "Unable to load internship."
                }
            )
        );
    }
});


// ===============================
// SUBMIT APPLICATION
// ===============================

app.post("/api/applications", (req, res) => {

    try {

        const {
            internshipId,
            name,
            email,
            portfolio
        } = req.body;


        // ===============================
        // REQUIRED FIELD VALIDATION
        // ===============================

        if (!internshipId || !name || !email) {

            return res.status(400).json(
                createResponse(
                    "error",
                    {
                        message:
                            "Internship, name and email are required."
                    }
                )
            );
        }


        // ===============================
        // NAME VALIDATION
        // ===============================

        const cleanName = name.trim();

        if (
            cleanName.length < 2 ||
            cleanName.length > 100
        ) {

            return res.status(400).json(
                createResponse(
                    "error",
                    {
                        message:
                            "Name must contain 2 to 100 characters."
                    }
                )
            );
        }


        // ===============================
        // EMAIL VALIDATION
        // ===============================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const cleanEmail =
            email.trim().toLowerCase();

        if (!emailPattern.test(cleanEmail)) {

            return res.status(400).json(
                createResponse(
                    "error",
                    {
                        message:
                            "Please enter a valid email address."
                    }
                )
            );
        }


        // ===============================
        // PORTFOLIO URL VALIDATION
        // ===============================

        let cleanPortfolio = "";

        if (portfolio && portfolio.trim()) {

            try {

                const url = new URL(
                    portfolio.trim()
                );

                if (
                    url.protocol !== "http:" &&
                    url.protocol !== "https:"
                ) {
                    throw new Error("Unsafe URL");
                }

                cleanPortfolio = url.href;

            } catch {

                return res.status(400).json(
                    createResponse(
                        "error",
                        {
                            message:
                                "Portfolio must be a valid HTTP or HTTPS URL."
                        }
                    )
                );
            }
        }


        // ===============================
        // CHECK INTERNSHIP
        // ===============================

        const internshipDatabase =
            readJSON(internshipsFile);

        const internship =
            internshipDatabase.internships.find(
                (item) => item.id === internshipId
            );


        if (!internship) {

            return res.status(404).json(
                createResponse(
                    "error",
                    {
                        message:
                            "The selected internship does not exist."
                    }
                )
            );
        }


        // ===============================
        // READ APPLICATIONS
        // ===============================

        const applicationDatabase =
            readJSON(applicationsFile);

        const applications =
            applicationDatabase.applications;


        // ===============================
        // DUPLICATE CHECK
        // ===============================

        const duplicate =
            applications.some(
                (application) =>
                    application.internshipId === internshipId &&
                    application.email === cleanEmail
            );


        if (duplicate) {

            return res.status(409).json(
                createResponse(
                    "error",
                    {
                        message:
                            "You have already applied for this internship."
                    }
                )
            );
        }


        // ===============================
        // CREATE APPLICATION
        // ===============================

        const application = {

            id:
                `APP-${Date.now()}`,

            internshipId,

            name: cleanName,

            email: cleanEmail,

            portfolio: cleanPortfolio,

            createdAt:
                new Date().toISOString()
        };


        applications.push(application);


        // ===============================
        // SAVE APPLICATION
        // ===============================

        writeJSON(
            applicationsFile,
            {
                applications
            }
        );


        // IMPORTANT:
        // Do not log passwords,
        // tokens or complete applicant records.

        console.log(
            `Application received for ${internshipId}`
        );


        res.status(201).json(
            createResponse(
                "success",
                {
                    message:
                        "Application submitted successfully.",
                    applicationId:
                        application.id
                }
            )
        );

    } catch (error) {

        console.error(
            "Application error:",
            error.message
        );

        res.status(500).json(
            createResponse(
                "error",
                {
                    message:
                        "Unable to submit application."
                }
            )
        );
    }
});



 // ===============================
// GET ALL APPLICATIONS
// ===============================

app.get("/api/applications", (req, res) => {

    try {

        const applicationsData =
            readJSON(applicationsFile);

        const internshipsData =
            readJSON(internshipsFile);

        const applications =
            applicationsData.applications || [];

        const internships =
            internshipsData.internships || [];

        const safeApplications =
            applications.map(application => {

                const internship =
                    internships.find(
                        item =>
                            item.id === application.internshipId
                    );

                return {

                    id: application.id,

                    internshipId:
                        application.internshipId,

                    internshipTitle:
                        internship
                            ? internship.title
                            : "Internship unavailable",

                    internshipDomain:
                        internship
                            ? internship.domain
                            : "Unknown",

                    name:
                        application.name,

                    email:
                        application.email,

                    portfolio:
                        application.portfolio,

                    createdAt:
                        application.createdAt
                };

            });

        res.json(
            createResponse(
                "success",
                safeApplications,
                {
                    total:
                        safeApplications.length
                }
            )
        );

    } catch (error) {

        console.error(
            "Unable to read applications:",
            error.message
        );

        res.status(500).json(
            createResponse(
                "error",
                {
                    message:
                        "Unable to load applications."
                }
            )
        );

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `InternHub running at http://localhost:${PORT}`
    );

});
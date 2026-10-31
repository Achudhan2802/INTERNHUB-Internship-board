# 🚀 InternHub — Student Internship Board

A responsive full-stack internship board designed for students to discover internships, filter opportunities, view internship details, and submit applications.

InternHub is built using **HTML, CSS, JavaScript, Node.js, and Express.js**, with JSON files used for lightweight data storage.

---

## 📌 Project Overview

InternHub is a fictional student-focused internship platform that provides a simple and accessible way for students to explore internship opportunities.

The application allows users to:

* 🔎 Search for internships
* 🎯 Filter internships by domain
* 💻 Filter internships by work mode
* 📄 View detailed internship information
* 📝 Apply for internships
* 📋 View submitted applications
* 📱 Use the website on mobile, tablet, and desktop devices
* ♿ Navigate the website using keyboard-friendly controls
* ⚠️ Receive clear loading, error, empty, and validation states

The project follows a **multi-page architecture** with a Node.js + Express backend providing REST-style APIs.

---

# ✨ Features

## 🏠 Home Page

The home page provides:

* Hero section
* Internship search
* Internship statistics
* Featured internship cards
* Navigation to major sections
* Responsive layout
* Call-to-action buttons

### Statistics displayed

* Total internships
* Number of domains
* Total openings

---

## 💼 Internship Listing

The internship listing page provides:

* Internship search
* Domain filtering
* Work-mode filtering
* Pagination
* Internship cards
* Internship location
* Available openings
* Required skills
* Internship details link
* Application link

### Supported Work Modes

* Remote
* Hybrid
* On-site

### Example Domains

* Full Stack Development
* UI/UX
* Data Analytics
* Cyber Security

---

# 🔍 Search and Filtering

Users can search internships using keywords.

The backend searches across:

* Internship title
* Domain
* Location
* Work mode
* Skills

Example:

```text
Search: frontend
```

The API can be accessed using:

```text
/api/internships?search=frontend
```

Domain filtering:

```text
/api/internships?domain=Full%20Stack%20Development
```

Work-mode filtering:

```text
/api/internships?mode=Remote
```

Multiple filters can also be combined.

---

# 📄 Internship Details

Each internship has a dedicated details page.

The details page displays:

* Internship title
* Domain
* Location
* Work mode
* Description
* Required skills
* Requirements
* Number of openings
* Apply button

Internships are accessed using their unique ID.

Example:

```text
/details.html?id=INT-101
```

---

# 📝 Application System

Students can apply for an internship using the application form.

The application form collects:

* Name
* Email
* Portfolio URL

The selected internship is automatically associated with the application.

---

# 🛡️ Application Validation

Validation is performed on both the **frontend and backend**.

Backend validation is important because users can bypass frontend validation.

## Name validation

The name must:

* Be provided
* Contain at least 2 characters
* Contain no more than 100 characters

Example error:

```text
Name must contain 2 to 100 characters.
```

---

## Email validation

The application checks whether the email follows a valid email format.

Example:

```text
student@example.com
```

Invalid email addresses are rejected.

---

## Portfolio URL validation

Portfolio URLs are optional.

If provided, only:

```text
http://
https://
```

URLs are accepted.

Unsafe or invalid URLs are rejected.

---

## Internship validation

The backend verifies that the selected internship actually exists.

If an invalid internship ID is submitted, the application is rejected.

---

## Duplicate Application Protection

A student cannot submit another application for the same internship using the same email address.

The backend checks:

```text
internshipId + email
```

If a duplicate application is detected, the server returns:

```text
HTTP 409 Conflict
```

with an appropriate error message.

---

# 📋 My Applications

The My Applications page retrieves submitted applications from the backend.

It displays:

* Application ID
* Internship title
* Internship domain
* Internship ID
* Applicant name
* Email
* Portfolio
* Application date
* Submission status

The page also handles:

* Loading state
* Empty state
* Error state
* Retry action

---

# ⚙️ Backend

The backend is implemented using:

* Node.js
* Express.js
* dotenv
* File System (`fs`)
* JSON files

The main backend file is:

```text
server.js
```

The server provides APIs for:

* Retrieving internships
* Retrieving individual internships
* Submitting applications
* Retrieving applications

---

# 🔌 API Documentation

All API responses follow a predictable structure:

```json
{
  "status": "success",
  "data": {},
  "meta": {}
}
```

For errors:

```json
{
  "status": "error",
  "data": {
    "message": "Error message"
  },
  "meta": {}
}
```

---

## GET `/api/internships`

Returns the internship list.

Example:

```text
GET /api/internships
```

### Query parameters

| Parameter | Description                |
| --------- | -------------------------- |
| `search`  | Search internship keywords |
| `domain`  | Filter by domain           |
| `mode`    | Filter by work mode        |
| `page`    | Page number                |
| `limit`   | Number of records per page |

Example:

```text
GET /api/internships?search=frontend
```

---

## GET `/api/internships/:id`

Returns a single internship.

Example:

```text
GET /api/internships/INT-101
```

Successful response:

```json
{
  "status": "success",
  "data": {
    "id": "INT-101",
    "title": "Frontend Intern"
  },
  "meta": {}
}
```

If the internship does not exist:

```text
HTTP 404
```

---

## POST `/api/applications`

Creates a new internship application.

Example request:

```json
{
  "internshipId": "INT-101",
  "name": "Student Name",
  "email": "student@example.com",
  "portfolio": "https://example.com"
}
```

Successful response:

```json
{
  "status": "success",
  "data": {
    "message": "Application submitted successfully.",
    "applicationId": "APP-123456789"
  },
  "meta": {}
}
```

---

## GET `/api/applications`

Returns submitted applications.

Example:

```text
GET /api/applications
```

Successful response:

```json
{
  "status": "success",
  "data": [],
  "meta": {
    "total": 0
  }
}
```

When applications exist, they are returned in the `data` array.

---

# 📂 Project Structure

```text
internship-board/
│
├── data/
│   ├── internships.json
│   └── applications.json
│
├── public/
│   │
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── common.js
│   │   ├── home.js
│   │   ├── internships.js
│   │   ├── details.js
│   │   ├── apply.js
│   │   └── applications.js
│   │
│   ├── index.html
│   ├── internships.html
│   ├── details.html
│   ├── apply.html
│   ├── applications.html
│   └── about.html
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

# 🧩 Technology Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Backend

* Node.js
* Express.js

## Data Storage

* JSON files

## Development Tools

* Visual Studio Code
* npm
* Git
* GitHub

## Deployment

* Node.js compatible cloud hosting

---

# 🗃️ Seed Data

The project includes five predefined internship records.

| ID      | Internship                 | Domain                 | Mode    |
| ------- | -------------------------- | ---------------------- | ------- |
| INT-101 | Frontend Intern            | Full Stack Development | Remote  |
| INT-102 | API Engineering Intern     | Full Stack Development | Hybrid  |
| INT-103 | UI/UX Intern               | UI/UX                  | Remote  |
| INT-104 | Data Analyst Intern        | Data Analytics         | On-site |
| INT-105 | Security Operations Intern | Cyber Security         | Remote  |

The seed internship IDs are preserved so that the frontend and backend can reference the same records.

---

# 📱 Responsive Design

InternHub is designed to work across:

* 📱 Mobile phones
* 📲 Tablets
* 💻 Laptops
* 🖥️ Desktop screens

The responsive stylesheet is:

```text
public/css/responsive.css
```

Special attention was given to small-screen layouts around **360px width**.

The design avoids unnecessary horizontal scrolling and adapts:

* Navigation
* Hero section
* Search controls
* Cards
* Forms
* Application layouts
* Footer
* Buttons

---

# ♿ Accessibility

Accessibility considerations included:

* Semantic HTML
* Form labels
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Appropriate links
* `aria-current` for the active navigation page
* Clear validation messages
* Loading states
* Error states
* Empty states

Users should be able to navigate major parts of the application using the keyboard.

---

# ⚠️ Loading, Error and Empty States

The application includes dedicated states for asynchronous operations.

## Loading

Displayed while API requests are being processed.

## Error

Displayed when the API request fails.

A retry button allows the user to attempt the request again.

## Empty

Displayed when no internship or application records are available.

This prevents the interface from appearing broken or blank.

---

# 🔐 Security Considerations

The project includes several basic security practices.

### Server-side validation

User input is validated on the backend instead of relying only on browser validation.

### URL validation

Portfolio URLs are restricted to:

```text
http://
https://
```

### Duplicate prevention

Duplicate applications are rejected.

### Sensitive files

The following files are excluded from Git:

```text
.env
data/applications.json
node_modules/
```

### Logging

The backend does not intentionally log:

* Passwords
* Access tokens
* Complete applicant records

Instead, application submission logs only the internship ID.

Example:

```text
Application received for INT-101
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/Achudhan2802/INTERNHUB-Internship-board.git
```

Move into the project:

```bash
cd INTERNHUB-Internship-board
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
```

---

## 4. Start the application

For normal execution:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

---

## 5. Open the application

Visit:

```text
http://localhost:3000
```

---

# 📦 NPM Scripts

The project contains the following scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Start

```bash
npm start
```

Starts the Express server.

### Development

```bash
npm run dev
```

Starts the server using Nodemon so changes automatically restart the application.

---

# 🧪 API Testing

The backend was tested using the following endpoints.

### Internship API

```text
GET /api/internships
```

Expected:

```text
HTTP 200
```

---

### Single internship

```text
GET /api/internships/INT-101
```

Expected:

```text
HTTP 200
```

---

### Invalid internship

```text
GET /api/internships/INVALID
```

Expected:

```text
HTTP 404
```

---

### Applications

```text
GET /api/applications
```

Expected:

```text
HTTP 200
```

---

### Application submission

```text
POST /api/applications
```

Expected for valid input:

```text
HTTP 201
```

---

### Duplicate application

Expected:

```text
HTTP 409
```

---

### Invalid application data

Expected:

```text
HTTP 400
```

---

# 🧪 Validation Test Cases

| Test Case             | Expected Result |
| --------------------- | --------------- |
| Valid application     | ✅ Accepted      |
| Missing name          | ❌ 400           |
| Missing email         | ❌ 400           |
| Invalid email         | ❌ 400           |
| Invalid portfolio URL | ❌ 400           |
| Invalid internship ID | ❌ 404           |
| Duplicate application | ❌ 409           |
| Valid portfolio URL   | ✅ Accepted      |

---

# 🖥️ User Flow

The main user journey is:

```text
Home
  ↓
Explore Internships
  ↓
Search / Filter
  ↓
Internship Details
  ↓
Apply Now
  ↓
Application Form
  ↓
Server Validation
  ↓
Application Saved
  ↓
My Applications
```

---

# 🎨 Design Goals

InternHub was designed with the following goals:

### 1. Simplicity

Students should be able to find an internship without a complicated interface.

### 2. Accessibility

The application should remain usable with keyboard navigation and clear interface feedback.

### 3. Responsiveness

The interface should adapt to different screen sizes.

### 4. Validation

Invalid application data should be rejected before it reaches the data store.

### 5. Clear User Feedback

The application communicates loading, success, error, and empty states clearly.

---

# 🚀 Deployment

The application can be deployed to a Node.js-compatible hosting platform.

For deployment, configure:

```text
Build Command:
npm install
```

```text
Start Command:
npm start
```

The server uses:

```javascript
process.env.PORT || 3000
```

so that the hosting platform can provide its required port.

After deployment, the application can be accessed through the hosting provider's public URL.

---

# ⚠️ Current Data Storage Limitation

This project uses JSON files instead of a production database.

Applications are stored in:

```text
data/applications.json
```

This approach is suitable for a learning project, prototype, or challenge submission.

For a production application, the JSON storage layer should be replaced with a database such as:

* PostgreSQL
* MySQL
* MongoDB

A production version should also include authentication and user-specific application access.

---

# 🔮 Future Improvements

Possible future improvements include:

* Student authentication
* Company/employer accounts
* Admin dashboard
* PostgreSQL/MySQL database
* Application status tracking
* Resume upload
* Internship bookmarking
* Email notifications
* Advanced filtering
* Sorting
* Search suggestions
* Admin internship management
* Role-based access control
* Application analytics
* Production-grade authentication
* Cloud file storage

---

# 🎓 Learning Outcomes

This project demonstrates practical knowledge of:

* HTML5
* CSS3
* Responsive web design
* JavaScript DOM manipulation
* Fetch API
* REST API concepts
* Node.js
* Express.js
* JSON data handling
* Server-side validation
* Client-side validation
* Error handling
* Git and GitHub
* API testing
* Accessibility
* Basic security practices
* Deployment concepts

---

# 👨‍💻 Project Information

**Project Name:** InternHub

**Project Type:** Full-Stack Web Application

**Purpose:** Student Internship Discovery and Application Platform

**Frontend:** HTML, CSS, JavaScript

**Backend:** Node.js + Express.js

**Storage:** JSON

**Repository:**
https://github.com/Achudhan2802/INTERNHUB-Internship-board

---

# 📄 License

This project was created for educational and internship-challenge purposes.

You may modify and extend the project for learning and academic purposes.

---

## ⭐ Conclusion

InternHub provides a complete student internship discovery workflow, from searching for opportunities to viewing details and submitting applications.

The project combines a responsive frontend with a Node.js/Express backend and demonstrates fundamental full-stack development practices including API design, validation, error handling, accessibility, responsive design, Git version control, and deployment readiness.

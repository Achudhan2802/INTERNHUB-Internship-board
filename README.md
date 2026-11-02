# InternHub – Internship Board

A full-stack internship discovery and application platform that helps students find internships, view detailed opportunities, and submit applications through a simple responsive interface.

## 🚀 Live Project

**Frontend:** Add your deployed frontend URL here

**Backend API:** Add your deployed backend URL here

**GitHub:**
https://github.com/Achudhan2802/INTERNHUB-Internship-board

## ✨ Features

- Browse available internships
- Search internships by title, skill, or location
- Filter internships by domain and work mode
- View complete internship details
- Submit internship applications
- Client-side form validation
- Server-side validation
- Loading and error states
- Retry functionality
- Pagination
- Responsive user interface
- API health check
- Request logging
- Rate limiting
- Security headers using Helmet
- Parameterized SQL queries

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive design
- Fetch API

### Backend

- Node.js
- Express.js
- PostgreSQL
- REST API

### Security

- Helmet
- Express Rate Limit
- Server-side validation
- Parameterized SQL queries

### Database

- PostgreSQL
- Neon

## 📂 Project Structure

```text
Internship-board/
│
├── index.html
├── internships.html
├── details.html
├── apply.html
├── about.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── home.js
│   ├── internships.js
│   ├── details.js
│   └── apply.js
│
├── server.js
├── package.json
├── .env
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Achudhan2802/INTERNHUB-Internship-board.git
```

### 2. Open the project

```bash
cd INTERNHUB-Internship-board
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required configuration.

Example:

```env
PORT=3000
```

Never commit real passwords, API keys, or database credentials to GitHub.

### 5. Start the frontend server

```bash
node server.js
```

The application will run at:

```text
http://localhost:3000
```

## 🔗 Backend API

The backend repository is available here:

https://github.com/Achudhan2802/INTERNSHIP-API

Local backend:

```text
http://localhost:5000
```

### Health Check

```text
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Internship API is running"
}
```

## 📡 API Endpoints

### Internships

```text
GET    /api/internships
GET    /api/internships/:id
POST   /api/internships
PUT    /api/internships/:id
DELETE  /api/internships/:id
```

### Applications

```text
POST /api/applications
GET  /api/applications
```

## 🔐 Security

The application includes:

- Helmet security headers
- API rate limiting
- Input validation
- Parameterized SQL queries
- Environment variables for sensitive configuration
- Proper HTTP error handling

## 🧪 Testing & Quality Checks

The following checks were performed:

- Internship listing functionality
- Search and filtering
- Internship details
- Application form
- Client-side validation
- Server-side validation
- Application submission
- API health check
- Error handling
- Retry functionality
- Pagination
- Responsive layout
- Security middleware
- API rate limiting

## 📱 User Journey

```text
Home
  ↓
Browse Internships
  ↓
Search / Filter
  ↓
View Internship Details
  ↓
Apply
  ↓
Fill Application Form
  ↓
Submit Application
  ↓
Success Confirmation
```

## 🎯 Project Objective

InternHub was developed as a full-stack internship platform focused on providing students with an easy way to discover relevant internship opportunities and submit applications.

The project demonstrates frontend development, REST API integration, database operations, validation, security, error handling, and production-readiness practices.

## 👨‍💻 Author

**Achudhan**

Computer Science Engineering Student

## 📄 License

This project is created for educational and academic purposes.

```

```

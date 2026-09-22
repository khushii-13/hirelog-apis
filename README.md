# HireLog APIs

Backend RESTful API for **HireLog**, a recruitment and job application tracking platform. Built with Node.js, Express, MongoDB, and Mongoose following a clean, layered (Controller-Service-Model) architecture.

---

## 📁 Project Architecture

```
hirelog-apis/
├── node_modules/
├── src/
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── jobController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── application.js
│   │   ├── job.js
│   │   └── user.js
│   ├── routes/
│   │   ├── application.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── job.js
│   │   └── user.js
│   ├── services/
│   │   ├── applicationService.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── jobService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── email.js
│   │   ├── error.js
│   │   ├── response.js
│   │   └── swagger.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

## 🏛️ Architectural Layers

1. **Routes (`src/routes`)**: Define endpoint URLs, HTTP methods, and attach validation or authentication middlewares.
2. **Controllers (`src/controllers`)**: Receive HTTP requests, validate input parameters, invoke the appropriate service, and return formatted responses.
3. **Services (`src/services`)**: Encapsulate all business logic, data manipulation, validation, and database operations.
4. **Models (`src/models`)**: Define Mongoose schemas and data models.
5. **Middlewares (`src/middlewares`)**: Handle authentication, role authorization, and file uploads.
6. **Utils (`src/utils`)**: Helper utilities for responses, error handling, Swagger specs, Cloudinary uploads, and emails.
7. **App & Server (`src/app.js` & `src/server.js`)**:
   - `src/app.js`: Configures the Express application, middlewares, routes, and Swagger docs.
   - `src/server.js`: Connects to MongoDB and starts listening on the configured port.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/khushii-13/hirelog-apis.git

# Navigate into project directory
cd hirelog-apis

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (see `.env.example`):
```env
PORT=8000
HOST=localhost
MONGO_URL=mongodb://localhost:27017/hirelog
SECRET_KEY=your_jwt_secret_key

# Cloudinary (Optional - for company logos)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional - for login notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Running the Application
```bash
# Development mode (auto-reloads on file changes)
npm run dev

# Production mode
npm start
```

---

## 📚 API Documentation (Swagger)

Once the server is running, navigate to:
```
http://localhost:8000/docs
```
to view the interactive Swagger UI and test endpoints directly.

---

## 🔗 Main API Endpoints

### Authentication (`/api/public/auth`)
- `POST /register` - Register a new user (job seeker or employer)
- `POST /login` - Login and receive JWT token
- `GET /get-user` - Get authenticated user profile

### User Profile (`/api/private/users`)
- `GET /get-user` - Get user profile

### Jobs (`/api/private/job`)
- `POST /create-job` - Post a new job (Employer only)
- `POST /get-jobs` - Get jobs with search/filters & pagination
- `GET /get-job?id=:id` - Get job details by ID
- `PUT /update-job/:id` - Edit job (Employer only)
- `DELETE /delete-job/:id` - Soft delete job (Employer only)
- `PATCH /toggle/:id` - Toggle job status active/inactive (Employer only)

### Applications (`/api/private/applications`)
- `POST /apply` - Submit an application (Job seeker only)
- `POST /get-my-applications` - View applicant's job applications
- `GET /get-job-applications/:jobId` - View applicants for a job (Employer only)
- `PATCH /status/:id` - Update applicant status (Employer only)
- `DELETE /:id` - Withdraw job application (Job seeker only)

### Dashboard (`/api/private/dashboard`)
- `GET /` - Fetch personalized metrics for Employer or Job Seeker

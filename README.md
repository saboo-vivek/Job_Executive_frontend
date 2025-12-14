# 🧠 Job Executive AI-Powered Job Portal (Full Stack)

Backend service for the **Job Executive** platform — a job portal connecting job seekers and employers, with an admin panel for system management.The project includes **AI-powered resume enhancement**, secure authentication, role-based access control, and a scalable backend designed for cloud hosting.

---

## 🚀 [Live Features](https://your-live-site-url.com)

### 👤 Multi-Role System
- **Job Seeker**
  - Profile creation and editing
  - Add skills, expected salary, and resume link
  - Apply for jobs
  - View application statuses
  - AI-powered resume booster
- **Employer**
  - Create and manage job postings
  - View applicants for each job
  - Shortlist, hire, or reject candidates
- **Admin**
  - Manage users and jobs
  - Delete users or job listings
  - Update user roles

---

### 🤖 AI Integration (Google Gemini API)
- **Resume Booster**
  - Enhances resume text using Gemini AI
  - Improves clarity, grammar, and professional tone
- Designed for future AI extensions such as:
  - Job description optimization
  - Smart job recommendations

---

### 📄 Resume Handling
- Resume shared as **Google Drive URL**
- No file storage required
- Hosting-friendly and scalable
- Users control access permissions

---

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based authorization
- Password hashing using bcrypt
- Protected routes for each role

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication
- Google Gemini API
- Swagger UI
- bcrypt, dotenv, cors, morgan

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/job-executive.git
cd backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Create Environment File
In the `backend` folder, create a `.env` file (see example below 👇).

### 4️⃣ Run MongoDB
If local:
```bash
mongodb
```
Or connect to **MongoDB Atlas** using your connection string.

### 5️⃣ Start the Server
```bash
npm start
```

### 6️⃣ View API Docs
Once the server is running, open Swagger UI in your browser:

🔗 **http://localhost:4000/api-docs**

---

## 📘 Example `.env` File

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/job_executive
JWT_SECRET=supersecretjwtkey
NODE_ENV=development
```

---

## 📍 API Endpoints Overview

### 🧑‍💼 Auth Routes (`/auth`)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/register` | Register new user (Seeker / Employer / Admin) |
| `POST` | `/auth/login` | Login and receive JWT token |
| `GET` | `/auth/me` | Get the currently logged-in user profile |

---

### 💼 Job Routes (`/job`)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/job` | Get all available jobs |
| `POST` | `/job` | Post a new job *(Employer only)* |
| `GET` | `/job/my/jobs` | Get all jobs posted by the logged-in employer |
| `DELETE` | `/job/:id` | Delete a job *(Employer or Admin)* |

---

### 📄 Application Routes (`/applications`)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/applications/:jobId/apply` | Apply to a job *(Seeker only)* |
| `GET` | `/applications/me` | Get all applications of the logged-in seeker |
| `GET` | `/applications/:jobId/applications` | View applicants for a specific job *(Employer only)* |
| `PUT` | `/applications/status/:applicationId` | Update application status *(Employer only)* |

---

### 🛠️ Admin Routes (`/admin`)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/admin/users` | Get all users *(Admin only)* |
| `GET` | `/admin/jobs` | Get all jobs *(Admin only)* |
| `DELETE` | `/admin/users/:id` | Delete a user *(Admin only)* |
| `DELETE` | `/admin/jobs/:id` | Delete a job *(Admin only)* |
| `PUT` | `/admin/users/:id/role` | Update a user’s role *(Admin only)* |

---

## 🧩 Database Schema Overview

### 🧍‍♂️ User Model
```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["SEEKER", "EMPLOYER", "ADMIN"] },
  photoUrl: String,
  company: String,       // for employers
  resumeUrl: String,     // for seekers
  appliedJobs: [ObjectId], // references Job IDs
  createdAt: Date,
  updatedAt: Date
}
```

---

### 💼 Job Model
```js
{
  _id: ObjectId,
  title: String,
  description: String,
  employerId: { type: ObjectId, ref: "User" },
  location: String,
  locationType: String, // e.g. Remote, On-site
  salaryMin: Number,
  salaryMax: Number,
  experienceLevel: String,
  applicants: [ObjectId],   // seeker IDs
  shortlisted: [ObjectId],  // seeker IDs
  rejected: [ObjectId],     // seeker IDs
  createdAt: Date,
  updatedAt: Date
}
```

---

### 📝 Application Model
```js
{
  _id: ObjectId,
  jobId: { type: ObjectId, ref: "Job" },
  seekerId: { type: ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"],
    default: "APPLIED"
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authentication

All protected routes require a JWT token.

**Example header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...
```

---

## 🧪 Example Testing Flow (via Swagger or Postman)

1. **Register Users:**
   - One **Seeker**, one **Employer**, one **Admin**.
2. **Login:**
   - Obtain JWT tokens for each.
3. **Employer:**
   - Post a job.
4. **Seeker:**
   - Apply for the job.
5. **Employer:**
   - View applicants and change status (e.g., Shortlisted).
6. **Admin:**
   - View all users/jobs and remove fake accounts.

---



## 🧭 Future Enhancements
- Email notifications on status updates  
- Resume uploads   
- Pagination and filters for job search  
- Admin analytics dashboard  

---

## 🧑‍💻 Author
**Vivek Sahu**  

---

## 🏁 License
This project is licensed under the **MIT License**.

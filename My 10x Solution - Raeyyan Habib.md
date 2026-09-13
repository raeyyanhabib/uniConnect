# My 10x Solution — Raeyyan Habib

**Project Name:** UniConnect  
**Author:** Raeyyan Habib  
**Track:** FlyRank Internship · Backend Track Capstone  

---

## 1. What is the problem you are solving?

### Problem Statement
University students struggle to efficiently coordinate peer study groups, discover course-specific study partners, and locate shared physical learning materials across campus. Existing channels like fragmented WhatsApp groups and informal word-of-mouth are noisy, decentralized, and lack verified persistence or structured resource tracking. UniConnect provides a unified, zero-friction campus platform where students can seamlessly create study squads, borrow academic resources, report lost & found items, and access automated academic activity insights.

### Who Has This Problem?
University undergraduate and graduate students, course teaching assistants, and campus community members seeking structured peer-to-peer academic collaboration.

### The 10x Claim
UniConnect makes finding a course study group or borrowing required textbooks **10x faster and easier** by eliminating messy multi-group messaging search and providing indexed, filtered, and persistent campus academic hubs with real-time reporting.

### Implemented Program Concepts (Section 2)
1. **API Endpoints**: Full Express REST API with standard HTTP status codes, structured JSON responses, and Zod schema validation.
2. **Database**: Prisma ORM with SQLite local file persistence (`dev.db`), ensuring data permanently survives application restarts.
3. **Authentication**: JWT-based authentication with bcrypt password hashing and token-protected routes.
4. **Background Jobs / Cron Jobs**: Automated periodic server background runner that cleans expired session tokens and logs system metrics off the request path.
5. **Reporting (PDF)**: Express `/api/reports/pdf` endpoint generating downloadable PDF summary reports for study groups and resource statistics using PDFKit.
6. **Caching Logic**: In-memory response caching middleware with TTL for search and discovery endpoints.
7. **Test Suite**: Automated API integration test suite covering auth, endpoints, and PDF streaming.

### Explicit Non-Goal
UniConnect will **NOT** include real-time video/audio streaming or custom webRTC calls. External communication links (Zoom, Google Meet, Microsoft Teams) can be shared within study group announcements.

---

## 2. How did you implement your solution?

### Architectural Overview
UniConnect is built as a full-stack web application with a modular Express.js backend and a React (Vite + TypeScript) frontend.

- **Backend Architecture (`/server`)**: Structured around standard Express controllers, middleware, and route modules. Database interaction is handled through Prisma ORM targeting an SQLite database file (`dev.db`), enabling zero-config execution on any machine.
- **Security & Authentication**: Endpoints requiring authenticated student privileges are guarded by `authenticateToken` middleware. Passwords are securely hashed with `bcryptjs`.
- **Background Maintenance**: A background job runner initializes alongside the Express server, executing periodic maintenance and metric calculations without blocking client requests.
- **Reporting & Caching**: The platform exposes `/api/reports/pdf`, which builds a styled PDF document using PDFKit. Expensive study group and resource queries pass through a lightweight TTL cache middleware (`cacheMiddleware`).

### Implemented Concepts Summary Table

| # | Concept | Implementation Location | Notes / Purpose |
|---|---|---|---|
| 1 | **API Endpoints** | `server/controllers/`, `server/routes/` | RESTful endpoints with Zod validation and standard HTTP status codes |
| 2 | **Database** | `server/prisma/schema.prisma` | Real SQLite persistence (`dev.db`) via Prisma ORM |
| 3 | **Authentication** | `server/middleware/auth.js`, `server/controllers/authController.js` | JWT tokens & bcrypt password hashing |
| 4 | **Background Jobs** | `server/services/backgroundJobs.js` | Periodic metric logging and token cleanup timer |
| 5 | **Reporting — PDF** | `server/controllers/reportController.js`, `server/routes/reportRoutes.js` | Downloadable PDF summary generated with PDFKit |
| 6 | **Caching Logic** | `server/middleware/cache.js` | In-memory TTL cache for search & discovery endpoints |
| 7 | **Test Suite** | `server/tests/api.test.js` | Runnable automated integration test suite |

*(Note: All concepts implemented come directly from the core program concepts table with 0 swaps required).*

---

## 3. Steps to Run the Project

UniConnect starts with **two documented commands** on a clean machine:

### 1. Installation & Database Setup
```bash
npm install
npm run db:push
npm run seed
```

### 2. Launch Development Server
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### Demo Credentials (Seeded)
- **Student 1**: `alice@nu.edu.pk` / `Password123!`
- **Student 2**: `bob@nu.edu.pk` / `Password123!`
- **Admin**: `admin@nu.edu.pk` / `Password123!`

### Automated Tests
Run the test suite with:
```bash
npm test
```

# 🏛️ Digital Complaint Portal for Gram Panchayat

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, production-grade, full-stack civic grievance redressal and tracking web application designed specifically for **Gram Panchayat local governance**. Built with the **"Cyber Crunch" Civic-Tech** design system, this platform bridges rural citizens and Panchayat administrators with speed, transparency, and accountability.

---

## 📌 Table of Contents
1. [Key Features](#-key-features)
2. [Technology Stack](#-technology-stack)
3. [Design System & UI/UX](#-design-system--uiux)
4. [System Requirements](#-system-requirements)
5. [Quick Start & Installation](#-quick-start--installation)
6. [Demo Accounts](#-demo-accounts)
7. [Database Schema & Architecture](#-database-schema--architecture)
8. [API Documentation](#-api-documentation)
9. [Automated Testing & QA Verification](#-automated-testing--qa-verification)
10. [Project Structure](#-project-structure)
11. [Troubleshooting](#-troubleshooting)

---

## 🌟 Key Features

### 👤 Citizen Portal
- **Account Registration & Login**: Multi-identifier authentication (10-digit mobile number or email address), bcrypt password hashing, and persistent JWT session.
- **3-Step Complaint Submission Wizard**:
  - *Step 1: Basic Details*: Categorization (Roads, Street Lights, Water Supply, Drainage, Waste, Public Facilities, Other), title, and detailed description.
  - *Step 2: Location & Evidence*: Ward address landmark, one-click browser GPS coordinate detection (`navigator.geolocation`), and photographic evidence upload (JPG, PNG, WEBP max 5MB).
  - *Step 3: Review & Submit*: Summary confirmation before generating an official server-side sequential ID (`GP-YYYY-XXXX`).
- **Real-Time Complaint Tracking**:
  - Visual 5-stage lifecycle stepper: `SUBMITTED` &rarr; `UNDER_REVIEW` &rarr; `ASSIGNED` &rarr; `IN_PROGRESS` &rarr; `RESOLVED` (or `REJECTED`).
  - Immutable historical activity log with timestamps and officer remarks.
- **My Complaints Archive**: Comprehensive list with real-time multi-filter tabs (status, category), keyword search, and server-side pagination.
- **Citizen Feedback & Star Ratings**: Once marked resolved, citizens can rate service quality (1–5 stars) and submit review comments.
- **In-App Notification Center**: Instant bell alerts when complaints are reviewed, dispatched, or resolved, with unread badge counter and mark-as-read controls.
- **Citizen Profile & Security**: Manage residential ward address, phone number, and change passwords safely.

### 🛡️ Administration & Panchayat Officer Portal
- **Officer Dashboard**: Live metrics on total grievances, pending triage queue, active on-ground repairs, certified resolutions, and resolution percentage.
- **Master Complaint Management**:
  - Combined multi-faceted filtering: Category, Status, Responsible Department, and Time Range (7d, 30d, 90d, 1y).
  - Server-side case-insensitive search across ID, title, citizen name, phone, and location.
- **Administrative Triage & Validated Transitions**:
  - Finite-state transition validation preventing illegal jumps.
  - Mandatory administrative remarks logged to the historical audit trail.
  - Automated notification generation for the complainant citizen.
- **Departmental Work Assignment Board**:
  - Dispatch complaints to municipal crews: Road Maintenance, Water Supply, Sanitation, Street Lighting, Waste Management, or Public Facilities.
  - Record responsible engineer/staff name and work order notes.
- **Interactive Analytics (Recharts)**:
  - Category distribution bar chart.
  - Overall status donut chart.
  - Daily submission vs. resolution trend line chart with configurable time frames.
- **Official CSV Export**: Download structured, filtered grievance reports matching active search filters with SLA durations and resolution dates.
- **Registered Citizens Directory**: List village residents, contact info, ward locations, and complaint history counts.

### 🌐 Public Portal (No Login Required)
- **Civic Hero Section**: Dynamic statistics loaded from live database records ("Your Voice Matters").
- **Services Directory**: Overview of civic categories, common issues handled, and standard SLAs.
- **Public Complaint Tracker**: Track any `GP-YYYY-XXXX` complaint by ID to view progress and official remarks without exposing private citizen contact info.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, React Router v6, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, TypeScript, tsx, CORS, Helmet, Multer |
| **Database & ORM** | SQLite (zero-config local relational DB) / PostgreSQL compatible, Prisma ORM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing, Role-Based Access Control (RBAC) |
| **Validation** | Zod schema validation (frontend & backend) |

---

## 🎨 Design System & UI/UX

Inspired by a high-end **"Cyber Crunch" Civic-Tech** dashboard:
- **Primary Backgrounds**: Deep navy (`#06152F`), Dark navy (`#081B3A`), Midnight blue (`#031027`).
- **Accents**: Electric cyan (`#00C8FF`), Bright blue (`#1687FF`), Purple (`#7C3AED`).
- **Content Background**: Crisp modern canvas (`#F5F8FC`) with clean white rounded cards (`12–20px radius`).
- **Responsive Layout**: Designed for mobile (`320px`, `375px`), tablet (`768px`), and desktop (`1024px+`, `1440px`). Features collapsible sidebar drawers, mobile bottom navigation bar, and responsive table layouts.

---

## 💻 System Requirements
- **Node.js**: v18.0.0 or higher (v20.x recommended)
- **npm**: v9.0.0 or higher
- **OS**: Windows, macOS, or Linux

---

## 🚀 Quick Start & Installation

### 1. Clone or Open Workspace
```bash
cd "c:\Users\ADMIN\Desktop\gram panchayta"
```

### 2. Install Dependencies
Dependencies for root, server, and client are installed via:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Initialize Database & Seed Demo Data
```bash
npm run db:push
npm run seed
```

### 4. Start Full-Stack Application
Runs both backend (`http://localhost:5000`) and frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Visit the application in your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Accounts

The database comes pre-seeded with realistic demo accounts:

### 🛡️ Gram Panchayat Officer (Admin)
- **Email / ID**: `admin@grampanchayat.gov.in`
- **Password**: `Admin@123`
- **Role**: `ADMIN`
- *Access*: Admin Dashboard, Manage Complaints, Assign Work, Analytics, Reports, Citizens Directory.
- *Quick Login*: Click "Admin Officer" on the login screen to auto-fill credentials.

### 👤 Village Citizens (Complainants)
- **Account 1**: `ramesh.patil@example.com` / `Citizen@123` (Mobile: `9812345678`)
- **Account 2**: `sunita.sharma@example.com` / `Citizen@123` (Mobile: `9823456789`)
- **Account 3**: `vikram.singh@example.com` / `Citizen@123` (Mobile: `9834567890`)
- **Account 4**: `priya.kadam@example.com` / `Citizen@123` (Mobile: `9845678901`)
- **Account 5**: `anand.deshmukh@example.com` / `Citizen@123` (Mobile: `9856789012`)

---

## 🗄️ Database Schema & Architecture

The relational schema is defined in [`server/prisma/schema.prisma`](file:///c:/Users/ADMIN/Desktop/gram%20panchayta/server/prisma/schema.prisma):

```
 users (Citizens & Admins)
   ├── id (String, PK)
   ├── name, email (unique), mobile (unique), passwordHash, address, role
   ├── complaints ────┐ (1:N)
   ├── notifications ─┼─ (1:N)
   └── feedback ──────┤ (1:N)
                      │
 complaints ──────────┘
   ├── id (String, PK)
   ├── complaintNumber (unique, GP-YYYY-XXXX)
   ├── category, title, description, location, latitude, longitude, imageUrl
   ├── status (SUBMITTED, UNDER_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED)
   ├── assignedDepartment, assignedStaff
   ├── submittedAt, resolvedAt
   ├── statusHistory (1:N -> complaint_status_history)
   └── feedback (1:1 -> feedback)
```

---

## 📡 API Documentation

### Public Endpoints
- `GET /api/health` - System health check.
- `GET /api/public/stats` - Portal aggregate metrics (Total, Resolved, In Progress, Pending).
- `GET /api/public/track/:complaintNumber` - Public tracking without exposing citizen PII.

### Authentication Endpoints
- `POST /api/auth/register` - Register a citizen account.
- `POST /api/auth/login` - Authenticate via email/mobile + password.
- `POST /api/auth/logout` - Invalidate session.
- `GET /api/auth/me` - Get authenticated profile + unread count.
- `PATCH /api/auth/profile` - Update profile information.
- `PATCH /api/auth/change-password` - Change account password.

### Citizen Complaints Endpoints
- `GET /api/complaints` - List complaints filed by current user (with search, category, status, pagination).
- `POST /api/complaints` - Submit complaint with multipart/form-data image attachment.
- `GET /api/complaints/:id` - Detailed complaint dossier with timeline.
- `POST /api/complaints/:id/feedback` - Submit 1–5 star rating and comment on resolved grievances.

### Administrative Endpoints (`ADMIN` role required)
- `GET /api/admin/dashboard` - High-level metrics and recent queue.
- `GET /api/admin/complaints` - All complaints with multi-filter and pagination.
- `GET /api/admin/complaints/:id` - Complete complaint dossier with citizen PII.
- `PATCH /api/admin/complaints/:id/status` - Update complaint status with transition validation & remarks.
- `PATCH /api/admin/complaints/:id/assign` - Assign responsible department & staff.
- `GET /api/admin/users` - Directory of registered citizens.
- `GET /api/admin/analytics?timeRange=30d` - Aggregated chart data for Recharts.
- `GET /api/admin/reports` - Resolution rate and SLA performance metrics.
- `GET /api/admin/reports/export` - Download filtered complaints as UTF-8 CSV.

### Notification Endpoints
- `GET /api/notifications` - Retrieve citizen notifications with unread count.
- `PATCH /api/notifications/:id/read` - Mark single notification as read.
- `PATCH /api/notifications/read-all` - Mark all notifications as read.

---

## 🧪 Automated Testing & QA Verification

The project includes an end-to-end integration test suite verifying all 21 key workflows:

```bash
npm test
```

### Tested Scenarios:
1. Health check availability
2. Public stats live database computation
3. Public tracking by complaint ID (`GP-2026-0001`)
4. Public tracking privacy verification (citizen phone/email withheld)
5. Invalid complaint lookup error handling
6. Admin authentication & JWT token generation
7. Citizen authentication & JWT token generation
8. Rejection of invalid passwords (401)
9. Duplicate email registration rejection
10. Duplicate mobile registration rejection
11. Role authorization guard (Citizen blocked from `/api/admin/*` with 403)
12. Admin dashboard retrieval
13. Citizen complaint submission & sequential `GP-YYYY-XXXX` generation
14. Automatic creation of `ComplaintStatusHistory` on submission
15. Admin departmental assignment & transition to `ASSIGNED`
16. Admin status transition to `IN_PROGRESS` with remarks
17. Admin resolution certification & `resolvedAt` timestamping
18. Citizen 1–5 star feedback submission with review comment
19. Database analytics aggregation for categories and trends
20. Generation and formatting of CSV export report
21. Real-time in-app notification creation and delivery

---

## 📁 Project Structure

```
gram-panchayat-portal/
├── client/                           # Frontend React + TypeScript application
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Button, Badges, StatCard, Timeline, FileUpload, etc.
│   │   │   ├── layouts/              # PublicLayout, DashboardLayout
│   │   │   └── navigation/           # Navbar, Sidebar, MobileBottomNav, Footer
│   │   ├── context/                  # AuthContext, ToastContext
│   │   ├── pages/
│   │   │   ├── admin/                # Dashboard, Complaints, Assignments, Analytics, Reports, Users
│   │   │   ├── citizen/              # Dashboard, SubmitComplaint, MyComplaints, Detail, Track, Profile
│   │   │   └── public/               # LandingPage, About, Services, PublicTrack, Login, Register
│   │   ├── services/                 # Centralized api.ts fetch client
│   │   ├── types/                    # TypeScript data models and interfaces
│   │   ├── App.tsx                   # Route definitions
│   │   ├── index.css                 # Tailwind CSS styles & Cyber Crunch utilities
│   │   └── main.tsx                  # Vite React entry point
│   ├── tailwind.config.js            # Civic-Tech palette configuration
│   └── vite.config.ts                # Vite build & proxy settings
│
├── server/                           # Backend Node.js Express + TypeScript API
│   ├── prisma/
│   │   ├── schema.prisma             # Relational SQLite/PostgreSQL schema
│   │   └── seed.ts                   # Realistic seed data (Admin, Citizens, 16 Complaints)
│   ├── src/
│   │   ├── middleware/               # JWT authentication, role guards, Multer upload
│   │   ├── routes/                   # auth, public, complaints, admin, notifications
│   │   ├── utils/                    # complaintId generator (GP-YYYY-XXXX)
│   │   ├── validators/               # Zod input schemas
│   │   ├── database.ts               # Prisma Client singleton
│   │   ├── index.ts                  # Express application entry point
│   │   └── test-e2e.ts               # Comprehensive 21-step integration test runner
│   └── uploads/                      # Uploaded complaint photo evidence storage
│
├── .env.example                      # Environment variables template
├── package.json                      # Workspace orchestrator scripts
└── README.md                         # Documentation
```

---

## 🛠️ Production Build

To compile both backend TypeScript and frontend Vite assets for production:

```bash
npm run build
```

---

## ❓ Troubleshooting

| Issue | Resolution |
|---|---|
| `Port 5000 in use` | Change `PORT` in `server/.env` to another port (e.g., 5002) and update `vite.config.ts` proxy. |
| `Cannot find native binding` | Run `npm --prefix client install -D @rolldown/binding-win32-x64-msvc`. |
| `Database not found` | Run `npm run db:push && npm run seed` from the root workspace directory. |
| `File upload rejected` | Ensure images are JPG, JPEG, PNG, or WEBP and under 5MB in size. |

---

*Academic Community/Societal Project for Gram Panchayat E-Governance.*

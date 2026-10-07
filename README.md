# 🏛️ Digital Complaint Portal for Gram Panchayat

An official civic-tech web application connecting citizens and Gram Panchayat administration for streamlined reporting, tracking, and resolution of civic complaints.

[![Deploy to GitHub Pages](https://github.com/shivbiss91-dev/gram-panchayat/actions/workflows/deploy.yml/badge.svg)](https://github.com/shivbiss91-dev/gram-panchayat/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00C8FF?style=flat&logo=github)](https://shivbiss91-dev.github.io/gram-panchayat/)

---

## 🌐 Live Website

- **GitHub Pages Frontend**: [https://shivbiss91-dev.github.io/gram-panchayat/](https://shivbiss91-dev.github.io/gram-panchayat/)
- **Local Dev URL**: `http://localhost:5173/`

---

## 🔑 Demo Login Credentials

### 1. Panchayat Officer / Administrator
- **Login URL**: `/admin/login`
- **Email**: `admin@grampanchayat.gov.in`
- **Password**: `Admin@123`
- **Features**: Real-time KPI statistics, triage & assign complaints, official remarks, status transitions, analytics charts (Recharts), and CSV report export.

### 2. Citizen Account
- **Login URL**: `/login` (or register a new account at `/register`)
- **Email**: `ramesh.patil@example.com`
- **Password**: `Citizen@123`
- **Features**: 3-step complaint wizard with GPS location detection and photo upload, audit timeline, 5-star resolution feedback, and notifications.

### 3. Public Complaint Tracking (No Login Required)
- **Tracking URL**: `/track`
- **Sample IDs**: `GP-2026-0001`, `GP-2026-0002`, `GP-2026-0003`

---

## 🛠️ Tech Stack

- **Frontend**: React 18/19, TypeScript, Vite, Tailwind CSS, React Router, Lucide Icons, Recharts
- **Backend**: Node.js, Express.js, TypeScript, Multer, Zod
- **Database & ORM**: SQLite / PostgreSQL, Prisma ORM
- **Authentication**: JWT & Argon2/Bcrypt password hashing, Role-Based Access Control (RBAC)

---

## 🚀 How to Run Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shivbiss91-dev/gram-panchayat.git
cd gram-panchayat

# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Set Up Database & Seed Data
```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..
```

### 3. Start Both Frontend & Backend
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 📄 License
MIT License. Built for Gram Panchayat Civic Administration.

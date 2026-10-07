import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './components/layouts/PublicLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PublicTrackPage } from './pages/public/PublicTrackPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { AdminLoginPage } from './pages/public/AdminLoginPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitComplaintPage } from './pages/citizen/SubmitComplaintPage';
import { MyComplaintsPage } from './pages/citizen/MyComplaintsPage';
import { CitizenComplaintDetail } from './pages/citizen/CitizenComplaintDetail';
import { CitizenTrackPage } from './pages/citizen/CitizenTrackPage';
import { CitizenProfilePage } from './pages/citizen/CitizenProfilePage';
import { CitizenNotificationsPage } from './pages/citizen/CitizenNotificationsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminComplaintDetail } from './pages/admin/AdminComplaintDetail';
import { AdminAssignmentsPage } from './pages/admin/AdminAssignmentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* 1. Public Routes with PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/track" element={<PublicTrackPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
            </Route>

            {/* 2. Citizen Protected Routes */}
            <Route element={<DashboardLayout requiredRole="CITIZEN" />}>
              <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
              <Route path="/citizen/complaints" element={<MyComplaintsPage />} />
              <Route path="/citizen/complaints/new" element={<SubmitComplaintPage />} />
              <Route path="/citizen/complaints/:id" element={<CitizenComplaintDetail />} />
              <Route path="/citizen/track" element={<CitizenTrackPage />} />
              <Route path="/citizen/profile" element={<CitizenProfilePage />} />
              <Route path="/citizen/notifications" element={<CitizenNotificationsPage />} />
            </Route>

            {/* 3. Admin Protected Routes */}
            <Route element={<DashboardLayout requiredRole="ADMIN" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
              <Route path="/admin/complaints/:id" element={<AdminComplaintDetail />} />
              <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
            </Route>

            {/* 4. Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

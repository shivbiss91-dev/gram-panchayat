import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../navigation/Sidebar';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { Menu, X, Shield, Bell } from 'lucide-react';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  requiredRole?: UserRole;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-deep flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-purple animate-spin flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-slate-300">Loading Gram Panchayat Portal...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'CITIZEN') {
      return <Navigate to="/citizen/dashboard" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return (
    <div className="flex h-screen bg-cyber-bg overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-cyber-deep text-white px-4 h-16 flex items-center justify-between border-b border-cyber-cyan/15 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 rounded-xl bg-cyber-dark text-slate-300 hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs tracking-wider text-white">
                GRAM PANCHAYAT
              </span>
              <span className="text-[10px] text-cyber-cyan font-bold uppercase">
                {user.role === 'ADMIN' ? 'Admin Portal' : 'Citizen Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

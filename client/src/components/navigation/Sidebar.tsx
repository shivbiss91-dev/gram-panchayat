import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Search,
  User,
  LogOut,
  Shield,
  FileSpreadsheet,
  Users,
  Briefcase,
  Bell,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  const citizenNavItems = [
    { label: 'Dashboard', path: '/citizen/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Submit Complaint', path: '/citizen/complaints/new', icon: <PlusCircle className="w-5 h-5" /> },
    { label: 'My Complaints', path: '/citizen/complaints', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Track Complaint', path: '/citizen/track', icon: <Search className="w-5 h-5" /> },
    { label: 'Notifications', path: '/citizen/notifications', icon: <Bell className="w-5 h-5" /> },
    { label: 'Profile Settings', path: '/citizen/profile', icon: <User className="w-5 h-5" /> },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'All Complaints', path: '/admin/complaints', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Assign Work', path: '/admin/assignments', icon: <Briefcase className="w-5 h-5" /> },
    { label: 'Reports & Export', path: '/admin/reports', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Citizens Directory', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Admin Profile', path: '/admin/profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems = isAdmin ? adminNavItems : citizenNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-cyber-deep border-r border-cyber-cyan/15 flex flex-col h-full text-slate-300">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center text-white shadow-cyber-glow flex-shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white tracking-wide leading-tight">
            GRAM PANCHAYAT
          </span>
          <span className="text-[11px] font-semibold text-cyber-cyan">
            {isAdmin ? 'ADMIN CONSOLE' : 'CITIZEN PORTAL'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {isAdmin ? 'Administration' : 'Services'}
          </span>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple text-white shadow-cyber-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-cyber-dark/80'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyber-cyan'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-cyber-midnight/60">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-cyber-dark/80 border border-slate-700/60 mb-2">
          <div className="w-9 h-9 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-bold text-xs flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-white truncate">{user?.name}</span>
            <span className="text-[10px] text-slate-400 truncate">{user?.email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

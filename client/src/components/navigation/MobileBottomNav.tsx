import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  User,
  Search,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === 'ADMIN';

  const items = isAdmin
    ? [
        { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Complaints', path: '/admin/complaints', icon: <ClipboardList className="w-5 h-5" /> },
        { label: 'Reports', path: '/admin/reports', icon: <Search className="w-5 h-5" /> },
        { label: 'Profile', path: '/admin/profile', icon: <User className="w-5 h-5" /> },
      ]
    : [
        { label: 'Home', path: '/citizen/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Complaints', path: '/citizen/complaints', icon: <ClipboardList className="w-5 h-5" /> },
        { label: 'Report', path: '/citizen/complaints/new', icon: <PlusCircle className="w-6 h-6 text-cyber-cyan" />, isAction: true },
        { label: 'Track', path: '/citizen/track', icon: <Search className="w-5 h-5" /> },
        { label: 'Profile', path: '/citizen/profile', icon: <User className="w-5 h-5" /> },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cyber-deep/95 backdrop-blur-lg border-t border-cyber-cyan/20 px-3 py-1.5 flex items-center justify-around text-slate-400">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              item.isAction
                ? 'scale-110 -translate-y-2'
                : isActive
                ? 'text-cyber-cyan font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.isAction ? (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center text-white shadow-cyber-glow">
                  <PlusCircle className="w-6 h-6" />
                </div>
              ) : (
                <span className={isActive ? 'text-cyber-cyan' : ''}>{item.icon}</span>
              )}
              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-cyber-cyan font-bold' : ''}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

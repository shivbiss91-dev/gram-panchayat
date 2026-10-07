import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';
import { NotificationItem } from '../../types';
import {
  Shield,
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  CheckCircle2,
  FileText,
  Search,
} from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      notificationApi
        .getAll()
        .then((res) => {
          if (res.success && res.data) {
            setNotifications(res.data.slice(0, 5));
            setUnreadCount(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Track Complaint', path: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cyber-deep/95 backdrop-blur-md border-b border-cyber-cyan/15 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center shadow-cyber-glow group-hover:scale-105 transition-transform flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wide text-white leading-tight flex items-center gap-1.5">
              GRAM PANCHAYAT
              <span className="text-[10px] bg-cyber-cyan/20 text-cyber-cyan px-1.5 py-0.5 rounded font-mono font-bold tracking-normal">
                CIVIC
              </span>
            </span>
            <span className="text-[11px] font-semibold text-cyber-cyan tracking-wider uppercase">
              Digital Complaint Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-cyber-dark/80 px-3 py-1.5 rounded-full border border-slate-700/60 shadow-inner">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-deep shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 rounded-xl bg-cyber-dark border border-slate-700/80 hover:border-cyber-cyan/50 text-slate-300 hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Panel */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 z-50 overflow-hidden animate-in fade-in duration-150">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                        Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-semibold text-cyber-blue hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications at the moment
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                              !n.read ? 'bg-cyan-50/50 font-medium' : ''
                            }`}
                          >
                            <p className="font-bold text-slate-800">{n.title}</p>
                            <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                      <Link
                        to={user.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/notifications'}
                        className="text-xs font-semibold text-cyber-blue hover:underline"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dashboard Link */}
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard'}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-cyber-dark border border-cyber-cyan/30 hover:border-cyber-cyan transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold text-cyber-cyan">
                    {user.role === 'ADMIN' ? 'Officer' : 'Citizen'}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2.5 rounded-xl bg-cyber-dark hover:bg-rose-950/60 border border-slate-700/80 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/notifications')}
              className="relative p-2 rounded-lg bg-cyber-dark text-slate-300"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-cyber-dark border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cyber-midnight border-b border-cyber-cyan/20 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  location.pathname === link.path
                    ? 'bg-cyber-cyan text-cyber-deep font-bold'
                    : 'text-slate-200 hover:bg-cyber-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={user.role === 'ADMIN' ? '/admin/dashboard' : '/citizen/dashboard'}
                  className="block w-full py-2.5 px-4 text-center rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-deep font-bold text-sm shadow-sm"
                >
                  Go to {user.role === 'ADMIN' ? 'Admin Portal' : 'My Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-800 text-rose-300 font-semibold text-sm hover:bg-slate-700"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="py-2.5 text-center rounded-xl border border-slate-700 text-white font-semibold text-sm hover:bg-cyber-dark"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 text-center rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-deep font-bold text-sm shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

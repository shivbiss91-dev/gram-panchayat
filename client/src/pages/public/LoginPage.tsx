import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, Phone, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      error('Please enter both your email/mobile and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(identifier.trim(), password);
      success(`Welcome back, ${user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/citizen/dashboard', { replace: true });
      }
    } catch (err: any) {
      error(err.message || 'Invalid email/mobile or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-click test credential fill for development & grading
  const fillDemoAccount = (type: 'citizen' | 'admin') => {
    if (type === 'admin') {
      setIdentifier('admin@grampanchayat.gov.in');
      setPassword('Admin@123');
    } else {
      setIdentifier('ramesh.patil@example.com');
      setPassword('Citizen@123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center text-white shadow-cyber-glow mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Sign In
          </h2>
          <p className="text-xs text-slate-500">
            Log in to access your complaints, track resolution, or manage Panchayat services.
          </p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyber-blue" />
              Demo Credentials (1-Click Fill):
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemoAccount('citizen')}
              className="py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-cyber-cyan text-left text-[11px] transition-colors"
            >
              <span className="font-bold text-slate-800 block">Citizen Demo</span>
              <span className="text-slate-400 block truncate">ramesh.patil@...</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-1.5 px-2.5 rounded-xl bg-cyber-dark text-white border border-cyber-cyan/30 hover:border-cyber-cyan text-left text-[11px] transition-colors"
            >
              <span className="font-bold text-cyber-cyan block">Admin Officer</span>
              <span className="text-slate-300 block truncate">admin@grampan...</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or 10-digit mobile"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Please contact Gram Panchayat administration or use test credentials.')}
                className="text-[11px] font-semibold text-cyber-blue hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-cyber-blue focus:ring-cyber-cyan"
              />
              <span>Remember this session</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Portal
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-cyber-blue hover:underline">
            Register as a Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};

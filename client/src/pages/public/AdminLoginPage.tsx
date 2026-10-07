import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldAlert, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('admin@grampanchayat.gov.in');
  const [password, setPassword] = useState('Admin@123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(identifier.trim(), password);
      if (user.role !== 'ADMIN') {
        error('This portal is restricted to authorized Gram Panchayat Officers only.');
        navigate('/citizen/dashboard');
        return;
      }
      success(`Welcome Officer, ${user.name}!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      error(err.message || 'Invalid administrative credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
      <div className="max-w-md w-full bg-cyber-deep p-8 sm:p-10 rounded-3xl border border-cyber-cyan/30 text-white shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyber-dark border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan shadow-cyber-glow mx-auto mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-cyan bg-cyber-dark/80 px-2.5 py-1 rounded-full border border-cyber-cyan/30">
            Official Access Only
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Panchayat Officer Console
          </h2>
          <p className="text-xs text-slate-400">
            Administrative access for Gram Sevak, Sarpanch, and Departmental Engineers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Official Email or ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cyber-dark border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cyber-dark border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Authenticate & Open Console
          </Button>
        </form>

        <div className="p-3 bg-cyber-dark/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
          Demo Admin prefilled. Authorized IP logging active.
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Shield, User, Mail, Phone, MapPin, Lock, Check, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Mobile number must be exactly 10 digits.';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errors.address = 'Please specify your village ward/street address (min 5 characters).';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        password: formData.password,
      });

      success(`Account created successfully! Welcome to Gram Panchayat, ${user.name}.`);
      navigate('/citizen/dashboard', { replace: true });
    } catch (err: any) {
      error(err.message || 'Failed to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-card space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center text-white shadow-cyber-glow mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Citizen Registration
          </h2>
          <p className="text-xs text-slate-500">
            Create an official Gram Panchayat citizen profile to submit complaints, track repairs, and provide feedback.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                    validationErrors.name
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-cyber-cyan'
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className="text-[11px] text-rose-500 mt-1">{validationErrors.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="10-digit mobile number"
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                    validationErrors.mobile
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-cyber-cyan'
                  }`}
                />
              </div>
              {validationErrors.mobile && (
                <p className="text-[11px] text-rose-500 mt-1">{validationErrors.mobile}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                required
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                  validationErrors.email
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-cyber-cyan'
                }`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-[11px] text-rose-500 mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Residential Address / Ward */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Residential Address / Ward Number *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House No, Lane name, Ward number, Gram Panchayat village"
                required
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                  validationErrors.address
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-cyber-cyan'
                }`}
              />
            </div>
            {validationErrors.address && (
              <p className="text-[11px] text-rose-500 mt-1">{validationErrors.address}</p>
            )}
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                    validationErrors.password
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-cyber-cyan'
                  }`}
                />
              </div>
              {validationErrors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="Re-type password"
                  required
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                    validationErrors.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-cyber-cyan'
                  }`}
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-[11px] text-rose-500 mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Citizen Account
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-cyber-blue hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

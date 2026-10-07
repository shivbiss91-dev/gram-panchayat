import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, MapPin, Lock, Save, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const CitizenProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error: toastError } = useToast();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !address.trim()) {
      toastError('Please fill out all profile fields.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
      });
      success('Profile details updated successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toastError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      toastError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toastError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal information, ward address, and account credentials.
        </p>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyber-blue flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-400">Used for complaint updates and SMS alerts</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Residential Ward / Village Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="md"
              isLoading={isUpdatingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-400">Keep your account secure with a strong password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={isChangingPassword}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

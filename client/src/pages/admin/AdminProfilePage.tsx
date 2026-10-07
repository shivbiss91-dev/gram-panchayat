import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Phone, MapPin, Lock, Save, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
      });
      success('Administrative profile updated successfully!');
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
      success('Officer password changed successfully!');
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
          Panchayat Officer Profile & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your administrative credentials and official contact details.
        </p>
      </div>

      {/* Admin Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyber-blue flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Officer Identification</h2>
            <p className="text-xs text-slate-400">Gram Panchayat administrative designation</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Officer Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Mobile Number *
              </label>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Panchayat Office Address *
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="md"
              isLoading={isUpdatingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Officer Details
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
            <h2 className="text-base font-bold text-slate-900">Change Officer Password</h2>
            <p className="text-xs text-slate-400">Ensure high security for administrative consoles</p>
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
              Update Admin Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

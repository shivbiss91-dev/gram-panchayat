import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { complaintApi } from '../../services/api';
import { Complaint } from '../../types';
import {
  PlusCircle,
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { CardSkeleton, TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    complaintApi
      .getComplaints({ limit: 5 })
      .then((res) => {
        if (res.success && res.data) {
          setComplaints(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Compute citizen's own stats
  const total = user?.totalComplaintsCount || complaints.length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
  const pending = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, {user?.name || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your civic grievances and Gram Panchayat requests.
          </p>
        </div>

        <Link to="/citizen/complaints/new">
          <Button
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="shadow-cyber-sm hover:shadow-cyber-glow"
          >
            Submit Complaint
          </Button>
        </Link>
      </div>

      {/* 2. "Make a Difference" Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyber-deep via-cyber-dark to-slate-900 text-white p-6 sm:p-8 border border-cyber-cyan/20 shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/15 text-cyber-cyan text-xs font-semibold border border-cyber-cyan/30">
            <span>Community Civic Action</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            Make a Difference in Your Ward
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Spotted a broken water pipe, dead street light, or road pothole? Report an issue now and help build a safer, cleaner Gram Panchayat.
          </p>
          <div className="pt-2">
            <Link to="/citizen/complaints/new">
              <Button size="sm" variant="primary">
                <span>File a Grievance Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyber-cyan/20 to-transparent pointer-events-none" />
      </div>

      {/* 3. Statistic Cards */}
      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={total}
            subtitle="Grievances registered by you"
            icon={<ClipboardList className="w-5 h-5" />}
            gradient="cyan"
          />
          <StatCard
            title="Pending Review"
            value={pending}
            subtitle="Under preliminary inspection"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            gradient="amber"
          />
          <StatCard
            title="In Progress"
            value={inProgress}
            subtitle="Field teams actively fixing"
            icon={<RefreshCw className="w-5 h-5 text-cyber-blue" />}
            gradient="blue"
          />
          <StatCard
            title="Resolved"
            value={resolved}
            subtitle="Completed & certified repairs"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            gradient="emerald"
          />
        </div>
      )}

      {/* 4. Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/citizen/complaints/new"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-cyber-cyan shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyber-blue flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Submit Complaint</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Register new issue</span>
          </Link>

          <Link
            to="/citizen/track"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-cyber-cyan shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">Track Status</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Search by GP ID</span>
          </Link>

          <Link
            to="/citizen/complaints"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-cyber-cyan shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">My Complaints</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">View full history</span>
          </Link>

          <Link
            to="/citizen/profile"
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-cyber-cyan shadow-sm hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 block">My Profile</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Update ward address</span>
          </Link>
        </div>
      </div>

      {/* 5. Recent Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Complaints</h3>
            <p className="text-xs text-slate-500">Your latest logged grievances</p>
          </div>
          <Link
            to="/citizen/complaints"
            className="text-xs font-bold text-cyber-blue hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints yet"
            description="You haven't submitted any complaints yet. Whenever you notice a civic issue, report it right away!"
            actionText="Submit Your First Complaint"
            onAction={() => navigate('/citizen/complaints/new')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Complaint ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Issue Title</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyber-blue">
                      {c.complaintNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <CategoryBadge category={c.category} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-800">
                      {c.title}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 max-w-[150px] truncate">
                      {c.location}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {new Date(c.submittedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link to={`/citizen/complaints/${c.id}`}>
                        <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

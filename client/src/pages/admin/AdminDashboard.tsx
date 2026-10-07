import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { AdminDashboardData } from '../../types';
import {
  ClipboardList,
  Clock,
  RefreshCw,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
  AlertTriangle,
  Briefcase,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { CardSkeleton, TableSkeleton } from '../../components/common/SkeletonLoader';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-dark text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 mb-2">
            <span>Gram Panchayat Administration Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Panchayat Officer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time monitoring of civic grievances, departmental assignments, and resolution performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/assignments">
            <Button variant="outline" size="sm" leftIcon={<Briefcase className="w-4 h-4 text-cyber-blue" />}>
              Assign Work
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="primary" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              Export Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      {isLoading || !data ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={data.totalComplaints}
            subtitle="All logged village grievances"
            icon={<ClipboardList className="w-5 h-5 text-cyber-blue" />}
            gradient="cyan"
          />
          <StatCard
            title="Pending Review"
            value={data.pendingReview}
            subtitle="Requires inspection / triage"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            gradient="amber"
          />
          <StatCard
            title="Active On-Ground"
            value={data.inProgress + data.assigned}
            subtitle={`${data.assigned} assigned, ${data.inProgress} in progress`}
            icon={<RefreshCw className="w-5 h-5 text-cyber-cyan" />}
            gradient="blue"
          />
          <StatCard
            title="Resolved Successfully"
            value={data.resolved}
            subtitle={`${data.resolutionRate}% total resolution rate`}
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            gradient="emerald"
            trend={`${data.resolutionRate}%`}
          />
        </div>
      )}

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/complaints?status=SUBMITTED"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Pending Inspection</span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Review & triage new complaints
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-500 transition-all" />
        </Link>

        <Link
          to="/admin/assignments"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-cyber-cyan shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyber-blue flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Department Dispatch</span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Assign road, electrical & water crew
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-cyber-blue transition-all" />
        </Link>

        <Link
          to="/admin/analytics"
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Analytics & Charts</span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Category trends & monthly data
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
        </Link>
      </div>

      {/* Recent Complaints Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Complaints Queue</h2>
            <p className="text-xs text-slate-500">Latest issues submitted by village residents</p>
          </div>
          <Link
            to="/admin/complaints"
            className="text-xs font-bold text-cyber-blue hover:underline flex items-center gap-1"
          >
            <span>View All ({data?.totalComplaints || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading || !data ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Complaint ID</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Issue Title</th>
                  <th className="py-3 px-3">Citizen Contact</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.recentComplaints.map((c) => (
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
                    <td className="py-3.5 px-3 text-slate-600">
                      <span className="font-semibold block">{c.user?.name}</span>
                      <span className="text-[10px] text-slate-400">{c.user?.mobile}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {c.assignedDepartment || <span className="text-amber-500 italic">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link to={`/admin/complaints/${c.id}`}>
                        <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Manage
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

import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  Percent,
  Timer,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

const CATEGORIES = [
  'ALL',
  'Road Issues',
  'Street Light Problems',
  'Water Supply Issues',
  'Drainage & Sanitation',
  'Waste Management',
  'Public Facilities',
  'Other',
];

export const AdminReportsPage: React.FC = () => {
  const [category, setCategory] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');

  const [metrics, setMetrics] = useState<{
    total: number;
    resolved: number;
    inProgress: number;
    pending: number;
    resolutionRate: number;
    avgResolutionDays: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getReports({ category, dateRange });
      if (res.success && res.data) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [category, dateRange]);

  const csvDownloadUrl = adminApi.exportCsvUrl({
    category,
    dateRange,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Governance Reports & Export
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Performance audits, SLA resolution durations, and official data export.
          </p>
        </div>

        {/* Real CSV Export Button */}
        <a href={csvDownloadUrl} download>
          <Button
            size="md"
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            className="shadow-cyber-sm"
          >
            Export Audited CSV Report
          </Button>
        </a>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyber-blue" />
            <span className="text-xs font-bold text-slate-700">Filter By Category:</span>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
          >
            <option value="ALL">All Civic Categories</option>
            {CATEGORIES.filter((c) => c !== 'ALL').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyber-blue" />
            <span className="text-xs font-bold text-slate-700">Reporting Timeframe:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
          >
            <option value="ALL">All Time</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading || !metrics ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints Analyzed"
            value={metrics.total}
            subtitle="Within selected filter scope"
            icon={<FileSpreadsheet className="w-5 h-5 text-cyber-blue" />}
            gradient="cyan"
          />
          <StatCard
            title="Resolution Success Rate"
            value={`${metrics.resolutionRate}%`}
            subtitle={`${metrics.resolved} of ${metrics.total} solved`}
            icon={<Percent className="w-5 h-5 text-emerald-500" />}
            gradient="emerald"
          />
          <StatCard
            title="Average Resolution Time"
            value={`${metrics.avgResolutionDays} Days`}
            subtitle="From submission to completion"
            icon={<Timer className="w-5 h-5 text-purple-600" />}
            gradient="purple"
          />
          <StatCard
            title="Pending & In-Progress"
            value={metrics.pending + metrics.inProgress}
            subtitle={`${metrics.pending} review, ${metrics.inProgress} active`}
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            gradient="amber"
          />
        </div>
      )}

      {/* Report Summary Narrative */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-cyber-blue" />
          <span>Performance Overview & Audit Summary</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-800 block text-sm">
              Grievance Lifecycle Efficiency
            </span>
            <p className="leading-relaxed">
              Based on active records, the Gram Panchayat achieves an average resolution duration of{' '}
              <strong>{metrics?.avgResolutionDays || 0} days</strong> across all civic infrastructure categories. The highest resolution speed is consistently achieved by Street Lighting and Water Supply emergency units.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-slate-800 block text-sm">
              Data Integrity & Public Export
            </span>
            <p className="leading-relaxed">
              Exporting the report will generate a structured, standard UTF-8 CSV containing complaint tracking IDs, exact ward landmarks, citizen names, assigned junior engineers, and timestamps for submission and completion.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Target Category: <strong>{category === 'ALL' ? 'All Categories' : category}</strong></span>
          <span>Time Scope: <strong>{dateRange === 'ALL' ? 'Complete Records' : dateRange}</strong></span>
        </div>
      </div>
    </div>
  );
};

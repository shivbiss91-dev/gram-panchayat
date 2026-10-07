import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Calendar, Info } from 'lucide-react';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

const TIME_RANGES = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'Last 6 Months', value: '6m' },
  { label: 'Last Year', value: '1y' },
];

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: '#3B82F6', // Blue
  UNDER_REVIEW: '#F59E0B', // Amber
  ASSIGNED: '#6366F1', // Indigo
  IN_PROGRESS: '#00C8FF', // Cyan
  RESOLVED: '#10B981', // Emerald
  REJECTED: '#EF4444', // Red
};

export const AdminAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<{
    categoryData: { category: string; count: number }[];
    statusData: { name: string; statusKey: string; value: number }[];
    trendData: { date: string; submitted: number; resolved: number }[];
    totalInRange: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAnalytics(timeRange);
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Header and Time Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Panchayat Analytics & Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data visualizations calculated from live database records.
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
          {TIME_RANGES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeRange(t.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                timeRange === t.value
                  ? 'bg-cyber-cyan text-cyber-deep shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !analyticsData ? (
        <div className="space-y-6">
          <CardSkeleton count={2} />
          <div className="h-80 bg-white rounded-3xl animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Two Charts Grid: Category Bar + Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Bar Chart: Complaints by Category */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyber-blue" />
                  <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {analyticsData.totalInRange} total records
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      angle={-20}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Bar dataKey="count" fill="#1687FF" radius={[8, 8, 0, 0]} name="Complaints" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Donut / Pie Chart: Overall Status */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Overall Status Breakdown</h3>
                </div>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.statusData.filter((s) => s.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {analyticsData.statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.statusKey] || '#94A3B8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 3. Line Chart: Complaint Trend Over Time */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Grievance Inflow vs. Resolution Trend
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Daily Timeline</span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.trendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="submitted"
                    stroke="#1687FF"
                    strokeWidth={2.5}
                    name="Submitted"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    name="Resolved"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

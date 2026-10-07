import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { Complaint, Pagination as PaginationType } from '../../types';
import {
  Search,
  Filter,
  Eye,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Pagination } from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

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

const STATUSES = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Submitted (New)', value: 'SUBMITTED' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const DEPARTMENTS = [
  'ALL',
  'Road Maintenance',
  'Water Supply',
  'Sanitation',
  'Street Lighting',
  'Waste Management',
  'Public Facilities',
];

export const AdminComplaintsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getComplaints({
        search,
        status: selectedStatus,
        category: selectedCategory,
        department: selectedDepartment,
        dateRange,
        page,
        limit: 10,
      });

      if (res.success && res.data) {
        setComplaints(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load admin complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedStatus, selectedCategory, selectedDepartment, dateRange, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchComplaints();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedDepartment('ALL');
    setDateRange('ALL');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    selectedStatus !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    dateRange !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Civic Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Master administrative index of all village complaints with full transition and assignment controls.
          </p>
        </div>

        <a
          href={adminApi.exportCsvUrl({
            category: selectedCategory,
            status: selectedStatus,
            dateRange,
          })}
          download
        >
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-4 h-4 text-cyber-blue" />}
          >
            Export Filtered CSV
          </Button>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-card space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, citizen name, phone, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.filter((c) => c !== 'ALL').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Department Select */}
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.filter((d) => d !== 'ALL').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Date Range Select */}
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            >
              <option value="ALL">All Dates</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="1y">Last 1 Year</option>
            </select>

            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Complaints Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints match your criteria"
            description="Try modifying search keywords or clearing active filters to see all records."
            actionText="Reset Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Complaint ID</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Issue Title</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Citizen Info</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-cyber-blue whitespace-nowrap">
                        {c.complaintNumber}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <CategoryBadge category={c.category} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 max-w-[180px] truncate text-slate-800">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-[140px] truncate">
                        {c.location}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                        <span className="font-bold block">{c.user?.name}</span>
                        <span className="text-[10px] text-slate-400">{c.user?.mobile}</span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {c.assignedDepartment || (
                          <span className="text-amber-500 font-medium italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(c.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
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

            {/* Pagination Controls */}
            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
};

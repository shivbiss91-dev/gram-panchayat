import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Pagination as PaginationType } from '../../types';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getUsers({ search, page, limit: 10 });
      if (res.success && res.data) {
        setUsers(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Registered Citizens Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Directory of registered village residents participating in local governance and grievance reporting.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-card">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search citizens by name, email, phone number, or ward address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            />
          </div>
          <Button type="submit" size="sm" variant="secondary">
            Search
          </Button>
          {search && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
            >
              Reset
            </Button>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No citizens found"
            description="No registered citizen records matched your search query."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Citizen Name</th>
                    <th className="py-3 px-3">Contact Details</th>
                    <th className="py-3 px-3">Ward Address</th>
                    <th className="py-3 px-3">Registration Date</th>
                    <th className="py-3 px-3 text-center">Grievances Filed</th>
                    <th className="py-3 px-3 text-right">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 text-cyber-blue font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-slate-400">Citizen Account</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {u.mobile}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {u.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{u.address}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          <ClipboardList className="w-3.5 h-3.5 text-cyber-blue" />
                          {u.complaintCount}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

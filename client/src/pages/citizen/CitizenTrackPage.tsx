import React, { useState } from 'react';
import { complaintApi } from '../../services/api';
import { Complaint } from '../../types';
import { Search, MapPin, Calendar, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Timeline } from '../../components/common/Timeline';
import { Link } from 'react-router-dom';

export const CitizenTrackPage: React.FC = () => {
  const [queryId, setQueryId] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryId.trim()) return;

    setIsLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const res = await complaintApi.getComplaints({ search: queryId.trim(), limit: 1 });
      if (res.success && res.data && res.data.length > 0) {
        // Fetch full details
        const full = await complaintApi.getComplaintById(res.data[0].id);
        if (full.success && full.data) {
          setComplaint(full.data);
        } else {
          setComplaint(res.data[0]);
        }
      } else {
        setError(`No complaint found with ID "${queryId.trim()}".`);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to track complaint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Complaint Progress
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Look up any of your registered complaints by its unique Panchayat ID.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. GP-2026-0001)"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            />
          </div>
          <Button type="submit" size="md" isLoading={isLoading}>
            Track Status
          </Button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {complaint && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-base font-extrabold text-cyber-blue bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-100">
                  {complaint.complaintNumber}
                </span>
                <StatusBadge status={complaint.status} size="md" />
                <CategoryBadge category={complaint.category} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{complaint.title}</h2>
            </div>

            <Link to={`/citizen/complaints/${complaint.id}`}>
              <Button variant="outline" size="sm" rightIcon={<Eye className="w-3.5 h-3.5" />}>
                Open Full Dossier
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {complaint.description}
          </p>

          <Timeline currentStatus={complaint.status} history={complaint.statusHistory} />
        </div>
      )}
    </div>
  );
};

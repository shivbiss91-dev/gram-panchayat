import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { Complaint } from '../../types';
import { Search, MapPin, Calendar, Building, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Timeline } from '../../components/common/Timeline';

export const PublicTrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [complaintNumber, setComplaintNumber] = useState(initialId);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (queryId: string) => {
    if (!queryId.trim()) return;
    setIsLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const res = await publicApi.trackComplaint(queryId.trim());
      if (res.success && res.data) {
        setComplaint(res.data);
      } else {
        setError(res.message || 'Complaint not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to track complaint. Please verify the ID.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      performSearch(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(complaintNumber);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyber-blue">
          Live Tracking System
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Civic Complaint
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Enter your unique Gram Panchayat Complaint ID to view live progress, officer assignments, and field remarks.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-card">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={complaintNumber}
              onChange={(e) => setComplaintNumber(e.target.value)}
              placeholder="Enter Complaint ID (e.g. GP-2026-0001)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent font-mono uppercase"
              required
            />
          </div>
          <Button type="submit" size="md" isLoading={isLoading}>
            Track Complaint
          </Button>
        </form>

        {/* Demo Quick Lookup helper */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Quick Demo IDs to test:</span>
          {['GP-2026-0001', 'GP-2026-0003', 'GP-2026-0006', 'GP-2026-0010'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setComplaintNumber(id);
                performSearch(id);
              }}
              className="font-mono bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-cyber-blue font-semibold transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Complaint Result */}
      {complaint && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6 animate-in fade-in duration-200">
          {/* Top summary header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="font-mono text-lg font-extrabold text-cyber-blue bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-100">
                  {complaint.complaintNumber}
                </span>
                <StatusBadge status={complaint.status} size="md" />
                <CategoryBadge category={complaint.category} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                {complaint.title}
              </h2>
            </div>

            <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">
                Responsible Division
              </span>
              <span className="text-xs font-bold text-slate-700 block mt-0.5">
                {complaint.assignedDepartment || 'Pending Assignment'}
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Location</span>
                <span className="font-semibold text-slate-800">{complaint.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Submitted On</span>
                <span className="font-semibold text-slate-800">
                  {new Date(complaint.submittedAt).toLocaleDateString(undefined, {
                    dateStyle: 'medium',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Resolution Date</span>
                <span className="font-semibold text-slate-800">
                  {complaint.resolvedAt
                    ? new Date(complaint.resolvedAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })
                    : 'In Process'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Complaint Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Evidence Image Preview if attached */}
          {complaint.imageUrl && (
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Attached Photographic Evidence</h4>
              <div className="w-48 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={complaint.imageUrl}
                  alt="Complaint evidence"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Interactive Progress Stepper & Timeline */}
          <div>
            <Timeline
              currentStatus={complaint.status}
              history={complaint.statusHistory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

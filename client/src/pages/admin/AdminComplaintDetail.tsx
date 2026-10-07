import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { Complaint, ComplaintStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Briefcase,
  Star,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Timeline } from '../../components/common/Timeline';
import { DetailSkeleton } from '../../components/common/SkeletonLoader';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

const DEPARTMENTS = [
  'Road Maintenance',
  'Water Supply',
  'Sanitation',
  'Street Lighting',
  'Waste Management',
  'Public Facilities',
  'Administration',
];

const ALLOWED_STATUSES: { label: string; value: ComplaintStatus }[] = [
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const AdminComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status Update Modal / Form State
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Assignment Modal / Form State
  const [assignDept, setAssignDept] = useState('Road Maintenance');
  const [assignStaff, setAssignStaff] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const fetchComplaint = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await adminApi.getComplaintById(id);
      if (res.success && res.data) {
        setComplaint(res.data);
        setNewStatus(res.data.status);
        if (res.data.assignedDepartment) {
          setAssignDept(res.data.assignedDepartment);
        }
        if (res.data.assignedStaff) {
          setAssignStaff(res.data.assignedStaff);
        }
      } else {
        toastError(res.message || 'Complaint not found.');
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to retrieve complaint.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!complaint) return;
    setIsUpdatingStatus(true);
    try {
      const res = await adminApi.updateStatus(complaint.id, {
        status: newStatus,
        remarks: statusRemarks.trim(),
      });
      if (res.success) {
        success(`Status successfully changed to ${newStatus.replace('_', ' ')}!`);
        setStatusRemarks('');
        setConfirmDialogOpen(false);
        fetchComplaint(); // Reload data from backend
      } else {
        toastError(res.message || 'Failed to update status.');
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;
    if (!assignStaff.trim()) {
      toastError('Please enter the name of the assigned engineer or staff member.');
      return;
    }

    setIsAssigning(true);
    try {
      const res = await adminApi.assignComplaint(complaint.id, {
        assignedDepartment: assignDept,
        assignedStaff: assignStaff.trim(),
        remarks: assignRemarks.trim(),
      });
      if (res.success) {
        success(`Grievance assigned to ${assignDept} (${assignStaff})!`);
        setAssignModalOpen(false);
        fetchComplaint();
      } else {
        toastError(res.message || 'Failed to assign complaint.');
      }
    } catch (err: any) {
      toastError(err.message || 'Assignment failed.');
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!complaint) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Complaint Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested complaint identifier does not exist.
        </p>
        <Link to="/admin/complaints">
          <Button variant="outline" size="sm">
            Back to All Complaints
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyber-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </Link>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setAssignModalOpen(true)}
          leftIcon={<Briefcase className="w-4 h-4 text-cyber-blue" />}
        >
          {complaint.assignedDepartment ? 'Reassign Department' : 'Assign Department'}
        </Button>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-base font-extrabold text-cyber-blue bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-100">
                {complaint.complaintNumber}
              </span>
              <StatusBadge status={complaint.status} size="md" />
              <CategoryBadge category={complaint.category} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
              {complaint.title}
            </h1>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-right min-w-[180px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Department Assigned
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              {complaint.assignedDepartment || (
                <span className="text-amber-600 font-semibold italic">Unassigned</span>
              )}
            </span>
            {complaint.assignedStaff && (
              <span className="text-[11px] text-slate-500 block">
                Staff: {complaint.assignedStaff}
              </span>
            )}
          </div>
        </div>

        {/* Citizen Information Card */}
        <div className="bg-cyber-dark/5 p-4 rounded-2xl border border-cyber-cyan/20 space-y-2">
          <div className="flex items-center justify-between border-b border-cyber-cyan/15 pb-2">
            <span className="text-xs font-bold text-cyber-deep flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyber-blue" />
              Citizen Contact Details
            </span>
            <span className="text-[11px] text-slate-500">Registered Citizen</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Name</span>
              <span className="font-bold text-slate-800">{complaint.user?.name || 'Citizen'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Mobile</span>
              <span className="font-bold text-slate-800">{complaint.user?.mobile || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Ward Address</span>
              <span className="font-medium text-slate-700 truncate block">
                {complaint.user?.address || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Site Location</span>
              <span className="font-semibold text-slate-800">{complaint.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Submitted At</span>
              <span className="font-semibold text-slate-800">
                {new Date(complaint.submittedAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolution Date</span>
              <span className="font-semibold text-slate-800">
                {complaint.resolvedAt
                  ? new Date(complaint.resolvedAt).toLocaleDateString()
                  : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
            Description
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </div>
        </div>

        {/* Uploaded Evidence Photo */}
        {complaint.imageUrl && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Citizen Photo Evidence
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-md bg-slate-100 shadow-sm">
              <img
                src={complaint.imageUrl}
                alt="Complaint evidence photo"
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          </div>
        )}

        {/* ADMIN STATUS UPDATE CONTROL (Section 32) */}
        <div className="pt-6 border-t border-slate-200 bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-cyber-blue" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Update Complaint Status & Administrative Remarks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              >
                {ALLOWED_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Remarks *
              </label>
              <input
                type="text"
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                placeholder="e.g. Site surveyed by JE, bitumen mix work completed, line tested..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => {
                if (newStatus === 'RESOLVED' || newStatus === 'REJECTED') {
                  setConfirmDialogOpen(true);
                } else {
                  handleStatusUpdate();
                }
              }}
              isLoading={isUpdatingStatus}
            >
              Update Status
            </Button>
          </div>
        </div>

        {/* Timeline Component */}
        <div className="pt-4 border-t border-slate-100">
          <Timeline currentStatus={complaint.status} history={complaint.statusHistory} />
        </div>

        {/* Citizen Feedback View if present */}
        {complaint.feedback && (
          <div className="pt-6 border-t border-slate-200">
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Citizen Feedback & Satisfaction Rating
              </span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < complaint.feedback!.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-800 ml-2">
                  {complaint.feedback.rating}/5 Stars
                </span>
              </div>
              {complaint.feedback.comment && (
                <p className="text-xs text-slate-700 italic">"{complaint.feedback.comment}"</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Status Change */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        title={newStatus === 'RESOLVED' ? 'Mark as Resolved?' : 'Reject / Close Complaint?'}
        message={
          newStatus === 'RESOLVED'
            ? 'Are you sure you want to certify this grievance as Resolved? This will notify the citizen and invite feedback.'
            : 'Are you sure you want to reject this complaint? Please ensure official remarks clearly state the jurisdiction reason.'
        }
        confirmText={newStatus === 'RESOLVED' ? 'Yes, Mark Resolved' : 'Yes, Close Grievance'}
        variant={newStatus === 'REJECTED' ? 'danger' : 'primary'}
        isLoading={isUpdatingStatus}
        onConfirm={handleStatusUpdate}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {/* Modal Dialog for Department Assignment */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyber-blue" />
                <span>Assign Responsible Team</span>
              </h3>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Division *
                </label>
                <select
                  value={assignDept}
                  onChange={(e) => setAssignDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsible Staff / Engineer Name *
                </label>
                <input
                  type="text"
                  value={assignStaff}
                  onChange={(e) => setAssignStaff(e.target.value)}
                  placeholder="e.g. Mahesh Jadhav (Junior Engineer)"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Order / Assignment Remarks
                </label>
                <input
                  type="text"
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  placeholder="e.g. Priority dispatch with 5 repair personnel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isAssigning}>
                  Confirm Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

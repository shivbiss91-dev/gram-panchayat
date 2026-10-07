import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complaintApi } from '../../services/api';
import { Complaint } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building,
  User,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Timeline } from '../../components/common/Timeline';
import { DetailSkeleton } from '../../components/common/SkeletonLoader';

export const CitizenComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Feedback Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const fetchComplaint = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await complaintApi.getComplaintById(id);
      if (res.success && res.data) {
        setComplaint(res.data);
        if (res.data.feedback) {
          setRating(res.data.feedback.rating);
          setComment(res.data.feedback.comment || '');
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setIsSubmittingFeedback(true);
    try {
      const res = await complaintApi.submitFeedback(complaint.id, {
        rating,
        comment: comment.trim(),
      });
      if (res.success) {
        success('Thank you! Your feedback has been recorded.');
        fetchComplaint(); // reload feedback
      } else {
        toastError(res.message || 'Failed to submit feedback.');
      }
    } catch (err: any) {
      toastError(err.message || 'Could not submit feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!complaint) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Complaint Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          This complaint record either does not exist or you do not have permission to view it.
        </p>
        <Link to="/citizen/complaints">
          <Button variant="outline" size="sm">
            Back to My Complaints
          </Button>
        </Link>
      </div>
    );
  }

  const isResolved = complaint.status === 'RESOLVED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/citizen/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyber-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints List</span>
        </Link>
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

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-right min-w-[160px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Assigned Department
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-0.5">
              {complaint.assignedDepartment || 'Pending Assignment'}
            </span>
            {complaint.assignedStaff && (
              <span className="text-[11px] text-slate-500 block">
                Officer: {complaint.assignedStaff}
              </span>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
              <span className="font-semibold text-slate-800">{complaint.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Submitted On</span>
              <span className="font-semibold text-slate-800">
                {new Date(complaint.submittedAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolution Status</span>
              <span className="font-semibold text-slate-800">
                {complaint.resolvedAt
                  ? `Resolved on ${new Date(complaint.resolvedAt).toLocaleDateString()}`
                  : 'Work In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Description Body */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
            Detailed Problem Description
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </div>
        </div>

        {/* Photographic Evidence */}
        {complaint.imageUrl && (
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Attached Photographic Evidence
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-md bg-slate-100 shadow-sm">
              <img
                src={complaint.imageUrl}
                alt="Complaint evidence on-ground"
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          </div>
        )}

        {/* Status Lifecycle & Administrative Timeline */}
        <div className="pt-4 border-t border-slate-100">
          <Timeline
            currentStatus={complaint.status}
            history={complaint.statusHistory}
          />
        </div>

        {/* 26. FEEDBACK SECTION (Visible only if Resolved) */}
        {isResolved && (
          <div className="pt-6 border-t border-slate-200">
            <div className="bg-gradient-to-br from-cyan-50/60 to-purple-50/40 rounded-3xl p-6 sm:p-8 border border-cyber-cyan/30 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-cyber-blue" />
                <h3 className="text-base font-extrabold text-slate-900">
                  How satisfied are you with the resolution?
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Your direct rating holds field contractors and Panchayat staff accountable. Help us improve civic service quality!
              </p>

              {complaint.feedback ? (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < complaint.feedback!.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {complaint.feedback.rating} out of 5 stars
                    </span>
                  </div>
                  {complaint.feedback.comment && (
                    <p className="text-xs text-slate-600 italic pl-1 border-l-2 border-cyber-cyan">
                      "{complaint.feedback.comment}"
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Submitted on {new Date(complaint.feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {/* Star Rating Select */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      const isFilled =
                        (hoverRating !== null ? hoverRating : rating) >= starValue;

                      return (
                        <button
                          key={starValue}
                          type="button"
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(starValue)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {rating} Star{rating > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Comment Textarea */}
                  <div>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience: Was the repair clean and timely? Any remaining concerns?"
                      maxLength={500}
                      className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {comment.length}/500 characters
                    </span>
                  </div>

                  <Button
                    type="submit"
                    size="md"
                    isLoading={isSubmittingFeedback}
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Submit Citizen Feedback
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

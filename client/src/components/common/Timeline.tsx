import React from 'react';
import { ComplaintStatus, ComplaintStatusHistory } from '../../types';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface TimelineProps {
  currentStatus: ComplaintStatus;
  history?: ComplaintStatusHistory[];
}

const STAGES: { key: ComplaintStatus; label: string }[] = [
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
];

export const Timeline: React.FC<TimelineProps> = ({
  currentStatus,
  history = [],
}) => {
  const isRejected = currentStatus === 'REJECTED';

  const getStageIndex = (status: ComplaintStatus): number => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'UNDER_REVIEW':
        return 1;
      case 'ASSIGNED':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'RESOLVED':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* 1. Status Progress Tracker */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
          Resolution Lifecycle
        </h4>

        {isRejected ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <div>
              <p className="font-semibold text-sm">Complaint Closed / Rejected</p>
              <p className="text-xs text-rose-600">
                This grievance has been reviewed and closed by the administration.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Connecting bar for desktop */}
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0" />
            <div
              className="hidden sm:block absolute top-4 left-6 h-0.5 bg-gradient-to-r from-cyber-cyan to-emerald-500 z-0 transition-all duration-500"
              style={{
                width: `${(Math.min(currentIndex, 4) / 4) * 88}%`,
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx < currentIndex || currentStatus === 'RESOLVED';
                const isCurrent = idx === currentIndex && currentStatus !== 'RESOLVED';

                return (
                  <div
                    key={stage.key}
                    className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? 'bg-cyber-cyan text-cyber-deep ring-4 ring-cyan-100 font-extrabold animate-pulse'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs sm:text-xs font-bold leading-tight ${
                          isCompleted
                            ? 'text-emerald-700'
                            : isCurrent
                            ? 'text-cyber-deep'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] text-cyber-blue font-semibold block">
                          Current Stage
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Detailed Status Event Log */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyber-blue" />
            <span>Complaint History & Administrative Timeline</span>
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-cyber-cyan group-hover:scale-125 transition-transform" />

                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/60">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-xs font-semibold text-slate-700">
                        by {item.changedBy}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  {item.remarks && (
                    <p className="text-xs text-slate-600 mt-1 pl-1 border-l-2 border-cyber-cyan/40">
                      {item.remarks}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

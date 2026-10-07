import React from 'react';
import { ComplaintStatus } from '../../types';
import {
  Clock,
  Search,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5 flex-shrink-0" />,
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Search className="w-3.5 h-3.5 flex-shrink-0" />,
    },
    ASSIGNED: {
      label: 'Assigned',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-300',
      icon: <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }} />,
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 flex-shrink-0" />,
    },
  };

  const config = configs[normalized] || {
    label: status,
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: <Clock className="w-3.5 h-3.5 flex-shrink-0" />,
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

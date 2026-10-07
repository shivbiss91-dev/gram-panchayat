import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  gradient?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient = 'cyan',
  trend,
}) => {
  const gradientBgs = {
    cyan: 'from-cyber-cyan/15 to-cyber-blue/15 text-cyber-blue border-cyber-cyan/25',
    blue: 'from-cyber-blue/15 to-cyber-purple/15 text-cyber-blue border-cyber-blue/25',
    purple: 'from-cyber-purple/15 to-violet-500/15 text-cyber-purple border-cyber-purple/25',
    emerald: 'from-emerald-500/15 to-teal-500/15 text-emerald-600 border-emerald-500/25',
    amber: 'from-amber-500/15 to-orange-500/15 text-amber-600 border-amber-500/25',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br border flex items-center justify-center flex-shrink-0 ${gradientBgs[gradient]}`}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};

import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-slate-100 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-xl mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center py-2 border-b border-slate-100">
            <div className="h-5 bg-slate-200 rounded w-24"></div>
            <div className="h-5 bg-slate-100 rounded w-32"></div>
            <div className="h-5 bg-slate-200 rounded flex-1"></div>
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            <div className="h-8 bg-slate-100 rounded-lg w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 animate-pulse space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-7 bg-slate-200 rounded w-48"></div>
        <div className="h-7 bg-slate-200 rounded-full w-24"></div>
      </div>
      <div className="h-4 bg-slate-100 rounded w-3/4"></div>
      <div className="h-24 bg-slate-100 rounded-xl"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-12 bg-slate-100 rounded-xl"></div>
        <div className="h-12 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
};

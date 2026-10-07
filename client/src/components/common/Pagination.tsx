import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '../../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to show
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 border-t border-slate-200 mt-4 text-xs text-slate-500">
      <div className="font-medium">
        Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{total}</span> records
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                p === page
                  ? 'bg-cyber-cyan text-cyber-deep shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-1 text-slate-400">
              ...
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

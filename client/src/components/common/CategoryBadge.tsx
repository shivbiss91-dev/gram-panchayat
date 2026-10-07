import React from 'react';
import {
  Lightbulb,
  Droplets,
  Trash2,
  Building2,
  Waves,
  Hammer,
  HelpCircle,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
}) => {
  const getIcon = () => {
    switch (category) {
      case 'Road Issues':
        return <Hammer className="w-3.5 h-3.5 text-amber-600" />;
      case 'Street Light Problems':
        return <Lightbulb className="w-3.5 h-3.5 text-yellow-600" />;
      case 'Water Supply Issues':
        return <Droplets className="w-3.5 h-3.5 text-blue-600" />;
      case 'Drainage & Sanitation':
        return <Waves className="w-3.5 h-3.5 text-teal-600" />;
      case 'Waste Management':
        return <Trash2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Public Facilities':
        return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 ${sizeClasses}`}
    >
      {getIcon()}
      <span>{category}</span>
    </span>
  );
};

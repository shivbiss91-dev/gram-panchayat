import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple text-white shadow-cyber-sm hover:shadow-cyber-glow focus:ring-cyber-cyan border-none',
    secondary:
      'bg-cyber-dark text-white hover:bg-cyber-deep border border-cyber-cyan/20 focus:ring-cyber-cyan',
    outline:
      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 focus:ring-cyber-blue shadow-sm',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-300',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

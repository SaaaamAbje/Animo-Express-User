import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#065F46] text-white hover:bg-[#047857] shadow-sm',
    secondary: 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-sm',
    outline: 'border-2 border-[#065F46] text-[#065F46] hover:bg-[#D1FAE5]',
    ghost: 'text-[#64748B] hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-6 py-3 text-base font-semibold rounded-xl',
    lg: 'px-8 py-4 text-lg font-bold rounded-2xl',
    icon: 'p-2 rounded-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

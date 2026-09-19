import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  className,
  label,
  error,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-[#334155] ml-1">
          {label}
        </label>
      ) }
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-[#065F46]">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none transition-all placeholder:text-[#94A3B8]',
            'focus:border-[#065F46] focus:ring-4 focus:ring-[#D1FAE5]',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
}

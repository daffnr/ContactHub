import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-400 dark:placeholder:text-slate-600',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 dark:border-rose-500/50',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-rose-500 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

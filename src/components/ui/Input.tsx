import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200',
              'border border-white/10 bg-white/5',
              'focus:outline-none focus:border-purple-500/50 focus:bg-white/8 focus:ring-1 focus:ring-purple-500/30',
              icon && 'pl-10',
              error && 'border-red-500/50 focus:border-red-500/70',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={4}
          className={cn(
            'w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 transition-all duration-200 resize-none',
            'border border-white/10 bg-white/5',
            'focus:outline-none focus:border-purple-500/50 focus:bg-white/8 focus:ring-1 focus:ring-purple-500/30',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl px-4 py-2.5 text-sm text-white transition-all duration-200',
            'border border-white/10 bg-dark-surface',
            'focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30',
            error && 'border-red-500/50',
            className
          )}
          style={{ backgroundColor: '#12152A' }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ backgroundColor: '#12152A' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
  {
    variants: {
      variant: {
        brand:   'text-white shadow-sm relative overflow-hidden',
        outline: 'border border-slate-300 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 bg-white',
        ghost:   'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
        danger:  'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
      },
      size: {
        sm:   'h-8 px-3 text-xs',
        md:   'h-10 px-5 text-sm',
        lg:   'h-12 px-7 text-base',
        xl:   'h-14 px-8 text-lg',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={variant === 'brand' ? {
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          boxShadow: '0 1px 3px rgba(79,70,229,0.3), 0 4px 12px rgba(79,70,229,0.15)',
        } : undefined}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Animated wrapper for brand button
export function AnimatedButton({ children, className, ...props }: ButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}

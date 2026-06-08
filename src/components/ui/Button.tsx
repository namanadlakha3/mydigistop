import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
  {
    variants: {
      variant: {
        brand: 'text-white relative overflow-hidden',
        outline: 'border border-white/20 text-white hover:border-white/40 hover:bg-white/5',
        ghost: 'text-white/70 hover:text-white hover:bg-white/5',
        danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        success: 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20',
        secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-lg',
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
        style={variant === 'brand' ? { background: 'linear-gradient(135deg, #6C47FF 0%, #00C2CB 100%)' } : undefined}
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

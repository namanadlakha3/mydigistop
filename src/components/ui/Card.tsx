import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, glass = true, onClick }: CardProps) {
  const Component = onClick ? motion.div : 'div';
  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'rounded-2xl p-6',
        glass && 'glass-card',
        !glass && 'rounded-2xl p-6',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-bold text-white', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm mt-1', className)} style={{ color: 'rgba(255,255,255,0.55)' }}>{children}</p>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mt-4 pt-4 border-t border-white/10', className)}>{children}</div>;
}

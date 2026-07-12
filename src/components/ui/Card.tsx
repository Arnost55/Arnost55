import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variants = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
      outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
      elevated: 'bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hover
      ? 'hover:shadow-xl hover:-translate-y-1 hover:border-indigo-500/50 dark:hover:border-indigo-500/50'
      : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
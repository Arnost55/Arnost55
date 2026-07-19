'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import type { HTMLAttributes, ForwardedRef } from 'react';

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'arc' | 'success' | 'warn' | 'danger' | 'outline' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  dotColor?: string;
}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  (
    { className, variant = 'brand', size = 'md', dot = false, dotColor, children, ...props },
    ref: ForwardedRef<HTMLSpanElement>
  ) => {
    const variantClasses = {
      brand: 'pill-brand',
      arc: 'pill-arc',
      success: 'pill-success',
      warn: 'bg-warn/15 text-warn',
      danger: 'bg-danger/15 text-danger',
      outline: 'border border-border text-fg2',
      neutral: 'bg-muted/15 text-fg2',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[11px]',
      md: 'px-3 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 font-semibold',
          'pill',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: dotColor || 'currentColor' }}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Pill.displayName = 'Pill';

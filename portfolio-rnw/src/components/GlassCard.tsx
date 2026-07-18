'use client';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type GlassCardProps = ComponentPropsWithoutRef<'div'> & {
  variant?: 'default' | 'light' | 'heavy';
  hover?: boolean;
};

export function GlassCard({
  variant = 'default',
  hover = true,
  className,
  children,
  ...props
}: GlassCardProps) {
  const baseClasses = {
    default: 'glass',
    light: 'glass-light',
    heavy: 'glass-heavy',
  };

  const hoverClasses = hover ? 'glass-hover' : '';

  return (
    <div
      className={cn(
        baseClasses[variant],
        hoverClasses,
        'transition-all duration-300 ease-standard',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
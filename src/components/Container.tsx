'use client';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export function Container({ className, size = 'lg', children, ...props }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1200px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn('mx-auto w-full px-6 lg:px-12', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
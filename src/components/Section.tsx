'use client';

import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

type SectionProps = ComponentPropsWithoutRef<'section'> & {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
};

export function Section({
  id,
  className,
  children,
  padding = 'lg',
  ...props
}: SectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-12 px-6',
    md: 'py-16 px-8',
    lg: 'py-24 px-8 lg:px-12',
    xl: 'py-32 px-8 lg:px-12',
  };

  const containerClasses = 'mx-auto max-w-[1200px]';

  return (
    <section
      id={id}
      className={cn('w-full', containerClasses, paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </section>
  );
}
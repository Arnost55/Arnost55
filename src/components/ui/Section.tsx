import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  className?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'gradient';
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ id, className, children, size = 'lg', background = 'default', ...props }, ref) => {
    const sizes = {
      sm: 'py-12 sm:py-16',
      md: 'py-16 sm:py-20 lg:py-24',
      lg: 'py-20 sm:py-24 lg:py-32',
      xl: 'py-24 sm:py-32 lg:py-40',
    };

    const backgrounds = {
      default: 'bg-white dark:bg-slate-950',
      muted: 'bg-slate-50 dark:bg-slate-900/50',
      gradient: 'bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'w-full',
          sizes[size],
          backgrounds[background],
          className
        )}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = 'Section';
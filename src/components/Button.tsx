'use client';

import { cn } from '@/lib/utils';
import { forwardRef, cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ForwardedRef, ReactElement } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'glass' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  /** When true, the button renders its single child element with the button's classes merged onto it (composition pattern). Useful for wrapping `<a>` / `<Link>`. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'gradient',
      size = 'md',
      loading = false,
      fullWidth = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-standard focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      gradient:
        'bg-gradient-to-r from-arc-peach-500 to-arc-coral-500 text-white shadow-[0_4px_16px_rgba(255,127,95,0.3)] hover:shadow-[0_8px_24px_rgba(255,127,95,0.4)] active:shadow-[0_2px_8px_rgba(255,127,95,0.3)]',
      glass:
        'bg-surface/80 backdrop-blur-xl border border-border text-fg hover:bg-surface-warm hover:border-border-soft',
      subtle: 'bg-transparent text-accent hover:bg-accent/10',
      outline: 'bg-transparent border-2 border-accent text-accent hover:bg-accent/10',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
    };

    const resolvedClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<any>;
      const childProps = child.props as Record<string, any>;
      return cloneElement(child, {
        ...props,
        disabled: disabled || loading || undefined,
        className: cn(childProps.className, resolvedClasses),
        ref,
      });
    }

    return (
      <button ref={ref} className={resolvedClasses} disabled={disabled || loading} {...props}>
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

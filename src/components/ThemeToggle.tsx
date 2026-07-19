'use client';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Always light mode' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Always dark mode' },
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Match OS preference',
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className={cn(
          'glass p-2 rounded-xl transition-all duration-200',
          'hover:bg-surface-warm',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20'
        )}
        aria-label={`Current theme: ${theme}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="theme-dropdown"
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-5 w-5 text-accent" aria-hidden="true" />
        ) : (
          <Sun className="h-5 w-5 text-arc-peach-500" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id="theme-dropdown"
          role="listbox"
          aria-label="Select theme"
          className="absolute right-0 top-full mt-2 min-w-[160px] glass-heavy rounded-2xl p-2 shadow-lg animate-fade-in z-50"
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              role="option"
              aria-selected={theme === option.value}
              onClick={() => {
                setTheme(option.value);
                setOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors',
                'hover:bg-surface-warm',
                theme === option.value ? 'bg-surface-warm text-accent' : 'text-fg-2'
              )}
            >
              <option.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted">{option.description}</div>
              </div>
              {theme === option.value && (
                <svg
                  className="h-4 w-4 flex-shrink-0 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

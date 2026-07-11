import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-xl transition-all duration-300',
        'bg-slate-100 dark:bg-slate-800',
        'hover:bg-slate-200 dark:hover:bg-slate-700',
        'text-slate-600 dark:text-slate-300',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950'
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
    >
      <span className="sr-only">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      <Sun
        className={cn(
          'absolute h-5 w-5 transition-all duration-300',
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          'absolute h-5 w-5 transition-all duration-300',
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        )}
        aria-hidden="true"
      />
    </button>
  );
}
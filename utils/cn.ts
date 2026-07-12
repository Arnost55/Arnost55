import { clsx, type ClassValue } from 'clsx';
import { tailwindMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return tailwindMerge(clsx(inputs));
}
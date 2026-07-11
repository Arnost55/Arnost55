import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  ...props
}: ModalProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4',
              'w-full pointer-events-none'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            <div
              className={cn(
                'relative w-full pointer-events-auto',
                'bg-white dark:bg-slate-900 rounded-2xl shadow-2xl',
                'border border-slate-200 dark:border-slate-800',
                sizes[size]
              )}
              {...props}
            >
              {(title || closeOnEscape) && (
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                  {title && (
                    <h2 id="modal-title" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {title}
                    </h2>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
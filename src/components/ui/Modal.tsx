import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#18221E] rounded-2xl shadow-xl border border-[#DCE6E0] dark:border-[#273830] overflow-hidden z-10 my-auto`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#E6EEE9] dark:border-[#23312A]">
              <div>
                <h3 id="modal-headline" className="text-lg font-semibold text-[#182B24] dark:text-[#E2ECE7]">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-[#6B7D75] dark:text-[#8B9F95] mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#6D8378] hover:text-[#182B24] hover:bg-[#EEF3F0] dark:text-[#889C92] dark:hover:text-white dark:hover:bg-[#23312B] transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

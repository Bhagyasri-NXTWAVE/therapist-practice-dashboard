import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { usePractice } from '../../context/PracticeContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePractice();

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const type = toast.type || 'success';
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="pointer-events-auto bg-white dark:bg-[#1C2622] border border-[#DCE6E0] dark:border-[#273830] rounded-xl shadow-lg p-3.5 flex items-start gap-3 select-none"
            >
              <div className="mt-0.5">{iconMap[type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#182C23] dark:text-[#E2ECE7]">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs text-[#6B7D75] dark:text-[#8E9F95] mt-0.5 line-clamp-2 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#7E9187] hover:text-[#182C23] dark:text-[#7A8E84] dark:hover:text-white p-0.5 rounded-md hover:bg-[#EEF3F0] dark:hover:bg-[#25362E] transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

enum ToastVariant {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error'
}

const TOAST_DURATION = 3500; // Auto-dismiss after 3 seconds
const TOAST_HIDE = 3000;
const getVariantClass = (variant: string) => {
  switch (variant) {
    case 'info':
      return 'alert-info';
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-error';
  }
};

export const showToast = (message: string, variant: string) => {
  document.dispatchEvent(
    new CustomEvent('toast', { detail: { type: 'toast', message, variant } })
  );
};

// Generate unique ID for each toast
let toastId = 0;
const getToastId = () => ++toastId;

interface ToastItem {
  id: number;
  message: string;
  variant: string;
  hide: boolean;
}

const Toast = () => {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (
      event: CustomEvent<{
        type: string;
        message: string;
        variant: 'info' | 'success' | 'error';
      }>
    ) => {
      if (event.detail.type === 'toast') {
        setQueue((prev) => [
          ...prev,
          {
            id: getToastId(),
            message: event.detail.message,
            variant: event.detail.variant,
            hide: false
          }
        ]);
      }
    };
    document.addEventListener('toast', handleToast as EventListener);
    return () => {
      document.removeEventListener('toast', handleToast as EventListener);
    };
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (queue.length === 0) return;

    const hideTimer = setTimeout(() => {
      setQueue((prev) => {
        const firstToast = prev[0];
        firstToast.hide = true;
        return [firstToast, ...prev.slice(1)];
      });
    }, TOAST_HIDE);
    const timer = setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, TOAST_DURATION);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [queue]);

  return (
    <div className="toast toast-top toast-end z-50">
      <AnimatePresence initial={false}>
        {queue.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`alert ${getVariantClass(item.variant)}`}
          >
            <span>{item.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;

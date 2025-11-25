import { useCallback, useState } from 'react';

type Toast = {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const onClose = useCallback((id: string) => {
    removeToast(id);
  }, [removeToast]);

  return {
    toasts,
    addToast,
    removeToast,
    onClose,
  };
}

export default useToast;

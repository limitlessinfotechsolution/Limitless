'use client';

import React, { createContext, useReducer, ReactNode } from 'react';
import Toast, { ToastType } from '../ui/Toast';

interface ToastState {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: Omit<ToastState, 'id'> }
  | { type: 'REMOVE_TOAST'; id: string };

interface ToastContextType {
  toasts: ToastState[];
  addToast: (toast: Omit<ToastState, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastReducer = (state: ToastState[], action: ToastAction): ToastState[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, { ...action.toast, id: Math.random().toString(36).substr(2, 9) }];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.id);
    default:
      return state;
  }
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = (toast: Omit<ToastState, 'id'>) => {
    dispatch({ type: 'ADD_TOAST', toast });
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            action={toast.action}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export { ToastContext };
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Notification } from '../../types';

interface ToastContextType {
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Notification[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border animate-in slide-in-from-right duration-300 ${
              toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-900' :
              toast.type === 'error' ? 'bg-white border-red-100 text-red-900' :
              'bg-white border-blue-100 text-blue-900'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-500 shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-red-500 shrink-0" />}
            {toast.type === 'info' && <Info size={20} className="text-blue-500 shrink-0" />}
            
            <div className="flex-1">
              <h4 className="text-sm font-bold">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>
            </div>
            
            <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
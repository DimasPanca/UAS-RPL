import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-fadeIn min-w-[280px] max-w-sm border"
          style={{
            background: toast.type === 'success'
              ? 'rgba(16,185,129,0.15)'
              : toast.type === 'error'
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(59,130,246,0.15)',
            borderColor: toast.type === 'success'
              ? 'rgba(16,185,129,0.3)'
              : toast.type === 'error'
              ? 'rgba(239,68,68,0.3)'
              : 'rgba(59,130,246,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {toast.type === 'success' && <CheckCircle className="text-emerald-400 shrink-0" size={18} />}
          {toast.type === 'error' && <XCircle className="text-red-400 shrink-0" size={18} />}
          {toast.type === 'info' && <Info className="text-blue-400 shrink-0" size={18} />}
          <span className="text-sm text-slate-200 flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

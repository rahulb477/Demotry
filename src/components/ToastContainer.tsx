import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((t) => {
        const getIcon = () => {
          switch (t.type) {
            case 'success':
              return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
            case 'error':
              return <XCircle className="w-5 h-5 flex-shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
            default:
              return <Info className="w-5 h-5 flex-shrink-0" />;
          }
        };

        return (
          <div key={t.id} className={`toast ${t.type}`}>
            {getIcon()}
            <span>{t.message}</span>
            <span className="toast-close" onClick={() => onRemove(t.id)}>
              <X className="w-4 h-4" />
            </span>
          </div>
        );
      })}
    </div>
  );
};

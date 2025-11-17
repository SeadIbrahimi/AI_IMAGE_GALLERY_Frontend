import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Notification({ message, type, onClose, duration = 5000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in"
      style={{
        backgroundColor: isSuccess ? '#C6F6D5' : '#FED7D7',
        color: isSuccess ? '#22543D' : '#742A2A',
        minWidth: '300px',
        maxWidth: '500px',
        border: `1px solid ${isSuccess ? '#9AE6B4' : '#FC8181'}`,
      }}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#38A169' }} />
      ) : (
        <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#E53E3E' }} />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

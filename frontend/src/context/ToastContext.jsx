import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmToast, setConfirmToast] = useState(null);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showConfirmToast = (message) => {
    return new Promise((resolve) => {
      setConfirmToast({ message, resolve });
    });
  };

  const handleConfirmResponse = (response) => {
    if (confirmToast) {
      confirmToast.resolve(response);
      setConfirmToast(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirmToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      {confirmToast && (
        <div className="confirm-toast-overlay">
          <div className="confirm-toast">
            <p>{confirmToast.message}</p>
            <div className="confirm-toast-buttons">
              <button 
                className="confirm-toast-btn confirm-toast-yes"
                onClick={() => handleConfirmResponse(true)}
              >
                Oui
              </button>
              <button 
                className="confirm-toast-btn confirm-toast-no"
                onClick={() => handleConfirmResponse(false)}
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

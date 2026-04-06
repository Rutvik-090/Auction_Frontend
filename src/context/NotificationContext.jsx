import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {notifications.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_8px_32px_0_rgba(19,27,46,0.12)] min-w-[300px] max-w-md animate-in slide-in-from-right-8 fade-in duration-300 ${
              toast.type === 'error' 
                ? 'bg-error-container text-on-error-container border border-error/20' 
                : toast.type === 'warning'
                ? 'bg-[#fff8e1] text-[#795548] border border-[#ffecb3]'
                : 'bg-primary-container text-on-primary-container border border-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'check_circle'}
            </span>
            <p className="font-bold text-sm tracking-wide flex-1 leading-snug">{toast.message}</p>
            <button 
              onClick={() => removeNotification(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity p-1 flex items-center justify-center rounded-full hover:bg-black/5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

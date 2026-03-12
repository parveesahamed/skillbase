import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: { icon: <FiCheckCircle size={20}/>, bg: 'bg-green-500', border: 'border-green-600' },
    error: { icon: <FiXCircle size={20}/>, bg: 'bg-red-500', border: 'border-red-600' },
    warning: { icon: <FiAlertCircle size={20}/>, bg: 'bg-yellow-500', border: 'border-yellow-600' },
    info: { icon: <FiInfo size={20}/>, bg: 'bg-blue-500', border: 'border-blue-600' },
  };

  const { icon, bg, border } = config[type] || config.success;

  return (
    <div className={`fixed top-20 right-4 ${bg} ${border} border-l-4 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 min-w-[300px] max-w-md toast-notification z-50`}>
      <div className="flex-shrink-0">{icon}</div>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-all">
        <FiX size={18}/>
      </button>
    </div>
  );
};

export default Toast;

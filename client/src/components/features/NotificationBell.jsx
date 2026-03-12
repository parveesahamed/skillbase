import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FiBell, FiCheck, FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiStar } from 'react-icons/fi';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => API.put(`/notifications/${n._id}/read`)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application': return <FiCheckCircle className="text-green-400" size={20} />;
      case 'status_change': return <FiAlertCircle className="text-yellow-400" size={20} />;
      case 'new_match': return <FiStar className="text-blue-400" size={20} />;
      default: return <FiInfo className="text-gray-400" size={20} />;
    }
  };

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="relative p-2 text-gray-700 hover:text-green-500 rounded-lg transition-all duration-300 hover:bg-white/20"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-lg shadow-red-500/40">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-2xl z-50 animate-slide-down overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.25)',
          }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}
          >
            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center space-x-1 transition-colors"
              >
                <FiCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center animate-fade-in">
                <FiBell className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif, index) => (
                <div
                  key={notif._id}
                  onClick={() => !notif.read && markAsRead(notif._id)}
                  className={`p-4 transition-all duration-300 cursor-pointer hover-lift ${!notif.read
                    ? 'bg-green-500/10 hover:bg-green-500/20'
                    : 'hover:bg-white/10'
                  }`}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: `slideUp 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1 p-1.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          notif.type === 'application' ? 'text-green-600' :
                          notif.type === 'status_change' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {notif.type.replace('_', ' ')}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${!notif.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                        {notif.message}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 block">{timeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <button className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

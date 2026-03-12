import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { FiMessageCircle, FiX, FiSend, FiSmile, FiCheck } from 'react-icons/fi';
import { io } from 'socket.io-client';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const SOCKET_URL = 'http://localhost:5000';

const LiveChatWidget = ({ receiverId, projectId }) => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  // --- Auto-scroll to bottom on new messages / typing ---
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    // Small delay so DOM updates first
    const t = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(t);
  }, [messages, isTyping, scrollToBottom]);

  // --- Helpers ---
  const isMine = useCallback((msg) => {
    const senderId = msg.sender?._id || msg.sender;
    return senderId === user?._id;
  }, [user]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- Fetch chat history (runs on mount + when panel opens) ---
  const fetchHistory = useCallback(async () => {
    if (!user || !receiverId || !projectId) return;
    try {
      setLoading(true);
      const res = await API.get(`/messages/${projectId}/${receiverId}`);
      setMessages(res.data);
      // Count unread from peer
      const unread = res.data.filter((m) => {
        const senderId = m.sender?._id || m.sender;
        return senderId === receiverId && !m.read;
      }).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user, receiverId, projectId]);

  // Load history on mount so unread badge is accurate
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Reload + clear unread when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
      setUnreadCount(0);
    }
  }, [isOpen, fetchHistory]);

  // --- Socket.io setup (only when user is logged in) ---
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register', user._id);
    });

    // Receive real-time messages without page refresh
    socket.on('receiveMessage', (msg) => {
      const mine = msg.sender?._id === user._id || msg.sender === user._id;
      const fromPeer =
        (msg.sender?._id === receiverId || msg.sender === receiverId) &&
        (msg.receiver?._id === user._id || msg.receiver === user._id);

      if (mine || fromPeer) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
        // Bump unread if chat panel is closed
        if (!isOpen && fromPeer) {
          setUnreadCount((c) => c + 1);
        }
      }
    });

    socket.on('userTyping', ({ senderName }) => {
      setIsTyping(true);
      setTypingUser(senderName);
    });

    socket.on('userStopTyping', () => {
      setIsTyping(false);
      setTypingUser('');
    });

    // Real-time read receipt — update tick colour instantly
    socket.on('messageRead', ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, read: true } : m))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user, receiverId, isOpen]);

  // --- Join / Leave project-specific room ---
  useEffect(() => {
    if (!socketRef.current || !projectId) return;

    if (isOpen) {
      socketRef.current.emit('joinRoom', projectId);
    }

    return () => {
      if (socketRef.current && projectId) {
        socketRef.current.emit('leaveRoom', projectId);
      }
    };
  }, [isOpen, projectId]);

  // --- Send message ---
  const handleSend = async () => {
    if (!inputText.trim() || !receiverId) return;

    try {
      const res = await API.post('/messages', {
        receiver: receiverId,
        project: projectId,
        content: inputText.trim(),
      });

      // Add to local state instantly
      setMessages((prev) => [...prev, res.data]);
      setInputText('');

      // Emit via socket for real-time delivery to the room
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          ...res.data,
          receiverId,
        });
        socketRef.current.emit('stopTyping', { receiverId, projectId });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // --- Typing indicator logic ---
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (socketRef.current && receiverId) {
      socketRef.current.emit('typing', {
        receiverId,
        senderName: user?.name || 'Someone',
        projectId,
      });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('stopTyping', { receiverId, projectId });
      }, 2000);
    }
  };

  // --- Mark message as read + emit via socket ---
  const markAsRead = useCallback(async (msgId) => {
    try {
      await API.put(`/messages/read/${msgId}`);
      // Also notify sender via socket so their ticks update in real-time
      if (socketRef.current && projectId) {
        socketRef.current.emit('messageRead', {
          messageId: msgId,
          readBy: user?._id,
          projectId,
        });
      }
    } catch {
      // Silently fail
    }
  }, [projectId, user]);

  // Auto-mark incoming messages as read when chat is open
  useEffect(() => {
    if (!isOpen || !user) return;
    messages.forEach((m) => {
      const senderId = m.sender?._id || m.sender;
      if (senderId === receiverId && !m.read) {
        markAsRead(m._id);
      }
    });
  }, [messages, isOpen, user, receiverId, markAsRead]);

  // --- Double-Tick Read Receipts ---
  const ReadReceipt = ({ msg }) => {
    if (!isMine(msg)) return null;
    // Double tick (blue) = read, Double tick (grey) = sent/delivered
    if (msg.read) {
      return (
        <span className="inline-flex ml-1.5" title="Read">
          <FiCheck className="text-blue-400 -mr-1.5" size={12} />
          <FiCheck className="text-blue-400" size={12} />
        </span>
      );
    }
    return (
      <span className="inline-flex ml-1.5" title="Sent">
        <FiCheck className="text-gray-300 -mr-1.5" size={12} />
        <FiCheck className="text-gray-300" size={12} />
      </span>
    );
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setUnreadCount(0); }}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <FiMessageCircle size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-lg shadow-red-500/40">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window — Glassmorphism */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-96 h-[520px] rounded-2xl flex flex-col z-50 animate-scale-in overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow:
              '0 8px 32px rgba(31, 38, 135, 0.3), inset 0 0 80px rgba(255,255,255,0.05)',
          }}
        >
          {/* Header */}
          <div
            className="text-white p-4 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(22,163,74,0.92), rgba(5,150,105,0.92))',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-lg">💬</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-sm">Project Chat</p>
                <p className="text-xs text-green-100">
                  {isTyping ? (
                    <span className="animate-pulse">{typingUser} is typing...</span>
                  ) : (
                    'Online'
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{
              background:
                'linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.85) 100%)',
            }}
          >
            {loading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !receiverId || !projectId ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm text-center px-4">
                  Open a project and select a user to start chatting.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full animate-fade-in">
                <div className="text-center">
                  <FiMessageCircle className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-400 text-sm">No messages yet. Say hello! 👋</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${isMine(msg) ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: `slideUp 0.25s ease-out ${Math.min(index * 0.03, 0.5)}s both` }}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                      isMine(msg) ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    style={
                      isMine(msg)
                        ? {
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                          }
                        : {
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                          }
                    }
                  >
                    <p className={`text-sm leading-relaxed ${isMine(msg) ? 'text-white' : 'text-gray-800'}`}>
                      {msg.content}
                    </p>
                    <p
                      className={`text-[10px] mt-1 flex items-center gap-0.5 ${
                        isMine(msg) ? 'text-green-100 justify-end' : 'text-gray-400'
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                      <ReadReceipt msg={msg} />
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator bubble */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div
                  className="rounded-2xl rounded-bl-sm px-4 py-2.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <p className="text-[10px] text-gray-500 mb-1 font-medium">{typingUser}</p>
                  <div className="flex space-x-1.5 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area — Glassmorphism */}
          <div
            className="p-3"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                <FiSmile size={20} />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={receiverId ? 'Type a message...' : 'Select a user to chat'}
                disabled={!receiverId}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all disabled:opacity-50 placeholder:text-gray-400"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || !receiverId}
                className="p-3 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChatWidget;

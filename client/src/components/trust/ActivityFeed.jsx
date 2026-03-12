import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiBriefcase, FiUserPlus, FiDollarSign, FiZap } from 'react-icons/fi';

const ActivityFeed = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [visible, setVisible] = useState(true);

  const activities = [
    { user: 'Sarah M.', action: 'just applied to', project: 'Web Development', icon: <FiBriefcase size={14}/>, color: 'bg-blue-500', time: '2m ago' },
    { user: 'James R.', action: 'completed', project: 'Mobile App Design', icon: <FiCheckCircle size={14}/>, color: 'bg-green-500', time: '5m ago' },
    { user: 'Emily C.', action: 'joined', project: 'SkillBridge AI', icon: <FiUserPlus size={14}/>, color: 'bg-purple-500', time: '8m ago' },
    { user: 'Michael K.', action: 'earned', project: '$850 on Design Project', icon: <FiDollarSign size={14}/>, color: 'bg-yellow-500', time: '12m ago' },
    { user: 'Lisa W.', action: 'got hired for', project: 'Content Writing', icon: <FiZap size={14}/>, color: 'bg-orange-500', time: '15m ago' },
    { user: 'David L.', action: 'posted', project: 'E-commerce Website', icon: <FiBriefcase size={14}/>, color: 'bg-indigo-500', time: '18m ago' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const activity = activities[currentActivity];

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-sm hover:scale-105 transition-transform">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              <span className="font-black">{activity.user}</span> {activity.action}
            </p>
            <p className="text-xs text-gray-600 truncate">{activity.project}</p>
          </div>
          <div className="text-xs text-gray-400 flex-shrink-0">{activity.time}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">Live Activity</span>
          </div>
          <div className="flex space-x-1">
            {activities.map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === currentActivity ? 'bg-green-500 w-3' : 'bg-gray-300'}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;

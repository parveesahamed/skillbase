import React from 'react';
import { FiCheckCircle, FiShield, FiAward, FiStar, FiClock } from 'react-icons/fi';

// Verification Badge Component
export const VerificationBadge = ({ type = 'student', verified = true }) => {
  if (!verified) return null;
  
  const config = {
    student: { 
      icon: <FiCheckCircle size={12}/>, 
      text: 'Verified Student', 
      bg: 'bg-blue-100', 
      text: 'text-blue-700',
      border: 'border-blue-300'
    },
    client: { 
      icon: <FiShield size={12}/>, 
      text: 'Verified Client', 
      bg: 'bg-green-100', 
      text: 'text-green-700',
      border: 'border-green-300'
    },
    top: { 
      icon: <FiAward size={12}/>, 
      text: 'Top Rated', 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700',
      border: 'border-yellow-300'
    },
    pro: { 
      icon: <FiStar size={12}/>, 
      text: 'Pro Member', 
      bg: 'bg-purple-100', 
      text: 'text-purple-700',
      border: 'border-purple-300'
    }
  };

  const badge = config[type];

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 ${badge.bg} ${badge.text} border ${badge.border} rounded-full text-xs font-semibold animate-bounce-in`}>
      {badge.icon}
      <span>{badge.text}</span>
    </div>
  );
};

// Success Rate Badge
export const SuccessRateBadge = ({ rate = 95 }) => {
  const color = rate >= 90 ? 'green' : rate >= 75 ? 'yellow' : 'red';
  return (
    <div className={`inline-flex items-center space-x-1 px-3 py-1 bg-${color}-100 text-${color}-700 border border-${color}-300 rounded-lg text-sm font-bold`}>
      <FiCheckCircle size={14}/>
      <span>{rate}% Success Rate</span>
    </div>
  );
};

// Rating Stars
export const RatingStars = ({ rating = 5, size = 16, showNumber = true }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <FiStar 
          key={i} 
          size={size} 
          className={i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
        />
      ))}
      {showNumber && <span className="text-sm font-semibold text-gray-700 ml-2">{rating.toFixed(1)}</span>}
    </div>
  );
};

// Response Time Badge
export const ResponseTimeBadge = ({ hours = 2 }) => {
  return (
    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
      <FiClock size={12}/>
      <span>Responds in {hours}h</span>
    </div>
  );
};

// Trust Shield Icon
export const TrustShield = () => {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
      <FiShield className="text-green-600" size={18}/>
      <div className="text-left">
        <p className="text-xs font-bold text-green-800">Payment Protected</p>
        <p className="text-xs text-green-600">Money-back guarantee</p>
      </div>
    </div>
  );
};

// SSL Badge
export const SSLBadge = () => {
  return (
    <div className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg">
      <FiShield className="text-gray-700" size={18}/>
      <div className="text-left">
        <p className="text-xs font-bold text-gray-800">SSL Secured</p>
        <p className="text-xs text-gray-600">256-bit encryption</p>
      </div>
    </div>
  );
};

export default {
  VerificationBadge,
  SuccessRateBadge,
  RatingStars,
  ResponseTimeBadge,
  TrustShield,
  SSLBadge
};

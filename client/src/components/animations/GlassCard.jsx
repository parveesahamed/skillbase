import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  blur = 'md',
  dark = false,
  onClick,
  hover = true
}) => {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const baseClasses = dark 
    ? 'bg-black bg-opacity-20 border-white border-opacity-10'
    : 'bg-white bg-opacity-10 border-white border-opacity-20';

  const hoverClasses = hover 
    ? 'hover:bg-opacity-20 hover:shadow-2xl hover:scale-105 transform transition-all duration-300'
    : '';

  return (
    <div 
      className={`${baseClasses} ${blurMap[blur]} ${hoverClasses} backdrop-saturate-150 border rounded-2xl shadow-xl ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;

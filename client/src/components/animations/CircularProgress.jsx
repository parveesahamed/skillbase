import React, { useEffect, useState } from 'react';

const CircularProgress = ({ 
  percentage = 75, 
  size = 120, 
  strokeWidth = 8, 
  color = '#22c55e',
  label = '',
  showPercentage = true,
  animate = true
}) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setProgress(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setProgress(percentage);
    }
  }, [percentage, animate]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-2xl font-black text-gray-800">{Math.round(progress)}%</span>
        )}
        {label && (
          <span className="text-xs text-gray-500 font-medium mt-1">{label}</span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;

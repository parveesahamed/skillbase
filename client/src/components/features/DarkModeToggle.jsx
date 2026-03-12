import React, { useState, useEffect } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 hover:scale-105 transform"
      aria-label="Toggle dark mode"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <FiMoon className="text-blue-500" size={12}/>
        ) : (
          <FiSun className="text-yellow-500" size={12}/>
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;

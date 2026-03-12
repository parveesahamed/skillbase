import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-green-600 to-teal-700 z-[9999] transition-transform duration-500 ease-in-out pointer-events-none ${
          isTransitioning ? 'translate-y-0' : '-translate-y-full'
        }`}
      />
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;

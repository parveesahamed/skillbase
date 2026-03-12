import React, { useEffect, useRef } from 'react';

const ParallaxSection = ({ 
  children, 
  className = '', 
  speed = 0.5,
  bgImage = null,
  bgColor = 'bg-gray-900'
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const bg = section.querySelector('.parallax-bg');
        if (bg) {
          bg.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      ref={sectionRef} 
      className={`relative overflow-hidden ${className}`}
    >
      <div 
        className={`parallax-bg absolute inset-0 ${bgColor}`}
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform'
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;

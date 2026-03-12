import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HowItWorks = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', maxWidth: '520px', padding: '0 24px' }}>
        <div style={{ display: 'inline-block', background: '#edfae8', color: '#14A800', fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', borderRadius: '100px', padding: '6px 16px', marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          What's New
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '40px', fontWeight: 800, color: '#181818', marginBottom: '16px', lineHeight: 1.2 }}>
          Coming Soon
        </h1>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '17px', color: '#5e6d55', lineHeight: 1.7, marginBottom: '36px' }}>
          We're working on something exciting. Updates, platform news, and feature announcements will appear here soon.
        </p>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#14A800', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', fontWeight: 600, padding: '12px 28px', borderRadius: '100px', textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1dbf00'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#14A800'; }}
        >
          Back to Home <FiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;



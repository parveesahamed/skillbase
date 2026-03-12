import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';

const Pricing = () => {
  return (
    <div style={{ minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '60px 24px' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        {/* Label */}
        <div style={{ display: 'inline-block', background: '#edfae8', color: '#14A800', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '100px', padding: '6px 18px', marginBottom: '28px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Pricing
        </div>

        {/* Divider line */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #d1fac8, transparent)', marginBottom: '32px' }} />

        {/* Main heading */}
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 800, color: '#181818', marginBottom: '10px', lineHeight: 1.2 }}>
          Currently Under Development
        </h1>

        {/* Divider line */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #d1fac8, transparent)', margin: '28px 0' }} />

        {/* Body text block */}
        <div style={{ background: '#fff', border: '1px solid #e6f4e2', borderRadius: '16px', padding: '36px 40px', marginBottom: '32px', textAlign: 'left' }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', color: '#374151', lineHeight: 1.8, marginBottom: '20px' }}>
            <strong style={{ color: '#181818' }}>SkillBridge AI</strong> is a final year academic project currently in development.
          </p>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', color: '#374151', lineHeight: 1.8, marginBottom: '20px' }}>
            Pricing models are being evaluated and will be finalized for production deployment.
          </p>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', color: '#374151', lineHeight: 1.8, marginBottom: '0' }}>
            For now, <strong style={{ color: '#14A800' }}>all features are free to use</strong> for testing and validation purposes.
          </p>
        </div>

        {/* Divider line */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #d1fac8, transparent)', marginBottom: '32px' }} />

        {/* Contact */}
        <a
          href="mailto:skillbridge@example.com"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#14A800', fontWeight: 600, textDecoration: 'none', marginBottom: '28px' }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
        >
          <FiMail size={16} />
          Questions? Contact us at: skillbridge@example.com
        </a>

        {/* Back button */}
        <div>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#14A800', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, padding: '11px 26px', borderRadius: '100px', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1dbf00'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#14A800'; }}
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Pricing;

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import SkillBridgeLogo from '../../assets/logo/SkillBridgeLogo';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';
import API from '../../utils/api';

const COUNTRIES = [
  'India','United States','United Kingdom','Canada','Australia','Germany','France',
  'Singapore','UAE','Netherlands','Sweden','Norway','Denmark','Finland','New Zealand',
  'South Africa','Brazil','Mexico','Japan','South Korea','Other'
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: 'India',
    userType: '',
    emailConsent: true,
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email } = result.user;
      const res = await API.post('/auth/social-login', {
        name: displayName,
        email,
        userType: formData.userType || 'student',
      });
      localStorage.setItem('token', res.data.token);
      // Update AuthContext user via a page reload or navigate
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.msg || 'Google sign-in failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }
    setError('');
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      await register(fullName, formData.email, formData.password, formData.userType);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  // Step 1: Role selection (Upwork style)
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white">
        {/* Top bar with logo + right link */}
        <div style={{ borderBottom: scrolled ? '1px solid #e0e0e0' : '1px solid transparent', position: 'sticky', top: 0, background: '#fff', zIndex: 50, transition: 'border-color 0.2s ease' }}>
          <div style={{ padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/">
              <SkillBridgeLogo width={130} height={20} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px' }}>
              <span style={{ color: '#181818', fontWeight: 400 }}>
                {formData.userType === 'client' ? 'Here to find work?' : 'Here to hire talent?'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, userType: formData.userType === 'client' ? 'student' : 'client' });
                  setStep(2);
                }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#14A800',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {formData.userType === 'client' ? 'Apply as a Student' : 'Join as a Client'}
              </button>
            </div>
          </div>
        </div>

        {/* Role selection content */}
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Neue Montreal', 'Plus Jakarta Sans', sans-serif",
            fontSize: '32px',
            fontWeight: 500,
            color: '#181818',
            marginBottom: '48px',
            lineHeight: 1.25
          }}>
            Join as a client or student
          </h1>

          {/* Cards */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
            {/* Client Card */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'client' })}
              style={{
                width: '240px',
                minHeight: '140px',
                padding: '24px',
                border: formData.userType === 'client' ? '2px solid #181818' : '1px solid #beccbe',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                if (formData.userType !== 'client') {
                  e.currentTarget.style.borderColor = '#181818';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.userType !== 'client') {
                  e.currentTarget.style.borderColor = '#beccbe';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Client icon - user-add */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#181818" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23,11H21V9a1,1,0,0,0-2,0v2H17a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V13h2a1,1,0,0,0,0-2Z"/><path d="M9,12A6,6,0,1,0,3,6,6.006,6.006,0,0,0,9,12ZM9,2A4,4,0,1,1,5,6,4,4,0,0,1,9,2Z"/><path d="M9,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,9,14Z"/>
                </svg>
                {/* Radio circle */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: formData.userType === 'client' ? '7px solid #181818' : '2px solid #beccbe',
                  transition: 'border 0.15s ease',
                  flexShrink: 0
                }} />
              </div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                color: '#181818',
                lineHeight: 1.4,
                marginTop: '16px'
              }}>
                I'm a client, hiring for<br />a project
              </p>
            </button>

            {/* Student Card */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, userType: 'student' })}
              style={{
                width: '240px',
                minHeight: '140px',
                padding: '24px',
                border: formData.userType === 'student' ? '2px solid #181818' : '1px solid #beccbe',
                borderRadius: '8px',
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                if (formData.userType !== 'student') {
                  e.currentTarget.style.borderColor = '#181818';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.userType !== 'student') {
                  e.currentTarget.style.borderColor = '#beccbe';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Student icon - member-search */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#181818" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.707,22.293l-3.54-3.54c.524-.791,.833-1.736,.833-2.753,0-2.757-2.243-5-5-5s-5,2.243-5,5,2.243,5,5,5c1.017,0,1.962-.309,2.753-.833l3.54,3.54c.195,.195,.451,.293,.707,.293s.512-.098,.707-.293c.391-.391,.391-1.023,0-1.414Zm-10.707-6.293c0-1.654,1.346-3,3-3s3,1.346,3,3-1.346,3-3,3-3-1.346-3-3Zm2-10c0-3.309-2.691-6-6-6S3,2.691,3,6s2.691,6,6,6,6-2.691,6-6Zm-6,4c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm-.008,4.938c.068,.548-.32,1.047-.869,1.116-3.491,.436-6.124,3.421-6.124,6.946,0,.552-.448,1-1,1s-1-.448-1-1c0-4.531,3.386-8.37,7.876-8.93,.542-.069,1.047,.32,1.116,.869Z"/>
                </svg>
                {/* Radio circle */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: formData.userType === 'student' ? '7px solid #181818' : '2px solid #beccbe',
                  transition: 'border 0.15s ease',
                  flexShrink: 0
                }} />
              </div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                color: '#181818',
                lineHeight: 1.4,
                marginTop: '16px'
              }}>
                I'm a student,<br />looking for work
              </p>
            </button>
          </div>

          {/* Create Account Button */}
          <button
            type="button"
            disabled={!formData.userType}
            onClick={() => setStep(2)}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              padding: '12px 32px',
              borderRadius: '10rem',
              border: 'none',
              color: '#fff',
              background: formData.userType ? '#14A800' : '#d5e0d5',
              cursor: formData.userType ? 'pointer' : 'default',
              transition: 'background 0.15s ease',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              if (formData.userType) e.currentTarget.style.background = '#1dbf00';
            }}
            onMouseLeave={(e) => {
              if (formData.userType) e.currentTarget.style.background = '#14A800';
            }}
          >
            {formData.userType === 'client' ? 'Join as a Client' : formData.userType === 'student' ? 'Apply as a Student' : 'Create Account'}
          </button>

          {/* Already have account */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            color: '#181818'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: '#14A800',
              textDecoration: 'underline',
              fontWeight: 500
            }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration form (Upwork-style)
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div style={{ borderBottom: scrolled ? '1px solid #e0e0e0' : '1px solid transparent', position: 'sticky', top: 0, background: '#fff', zIndex: 50, transition: 'border-color 0.2s ease' }}>
        <div style={{ padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/">
            <SkillBridgeLogo width={130} height={20} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px' }}>
            <span style={{ color: '#181818', fontWeight: 400 }}>
              {formData.userType === 'client' ? 'Here to find work?' : 'Here to hire talent?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, userType: formData.userType === 'client' ? 'student' : 'client' });
              }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                color: '#14A800',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {formData.userType === 'client' ? 'Apply as a Student' : 'Join as a Client'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '540px', margin: '0 auto', padding: '56px 24px 48px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '32px',
            fontWeight: 500,
            color: '#181818',
            marginBottom: '12px',
            lineHeight: 1.2
          }}>
            Sign up to {formData.userType === 'client' ? 'hire talent' : 'find work you love'}
          </h2>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              color: '#14A800',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            ← Back to role selection
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            {error}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '13px 20px',
            border: '1px solid #d5d5d5',
            borderRadius: '10rem',
            background: '#fff',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 500,
            color: '#181818',
            marginBottom: '24px',
            transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#181818'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d5d5d5'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* Google SVG Icon */}
          <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        {/* OR divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#6b7280', flexShrink: 0 }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
        </div>

        <form onSubmit={handleSubmit}>

          {/* First name + Last name row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#181818'}
                onBlur={(e) => e.target.style.borderColor = '#beccbe'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#181818'}
                onBlur={(e) => e.target.style.borderColor = '#beccbe'}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#181818'}
              onBlur={(e) => e.target.style.borderColor = '#beccbe'}
            />
          </div>

          {/* Password with show/hide */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (8 or more characters)"
                required
                minLength="8"
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={(e) => e.target.style.borderColor = '#181818'}
                onBlur={(e) => e.target.style.borderColor = '#beccbe'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9aaa97',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Country */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Country</label>
            <div style={{ position: 'relative' }}>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingRight: '40px',
                  cursor: 'pointer',
                  background: '#fff'
                }}
                onFocus={(e) => e.target.style.borderColor = '#181818'}
                onBlur={(e) => e.target.style.borderColor = '#beccbe'}
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* Chevron icon */}
              <svg style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9aaa97' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email consent */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="emailConsent"
                checked={formData.emailConsent}
                onChange={handleChange}
                style={checkboxStyle}
              />
              <span style={checkboxLabelStyle}>
                Send me helpful emails to find rewarding work and project leads.
              </span>
            </label>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                style={checkboxStyle}
              />
              <span style={checkboxLabelStyle}>
                Yes, I understand and agree to the{' '}
                <span style={{ color: '#14A800', textDecoration: 'underline', cursor: 'pointer' }}>SkillBridge Terms of Service</span>
                , including the{' '}
                <span style={{ color: '#14A800', textDecoration: 'underline', cursor: 'pointer' }}>User Agreement</span>
                {' '}and{' '}
                <span style={{ color: '#14A800', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              display: 'block',
              margin: '0 auto 24px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              padding: '14px 56px',
              borderRadius: '10rem',
              border: 'none',
              color: '#fff',
              background: '#14A800',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#108a00'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#14A800'}
          >
            Create my account
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '15px',
          color: '#181818'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#14A800', textDecoration: 'underline', fontWeight: 500 }}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ─── shared style objects ──────────────────────────────────────── */
const labelStyle = {
  display: 'block',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '14px',
  fontWeight: 500,
  color: '#181818',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  border: '1px solid #beccbe',
  borderRadius: '8px',
  fontSize: '16px',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: '#181818',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box'
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  marginTop: '2px',
  accentColor: '#14A800',
  flexShrink: 0,
  cursor: 'pointer'
};

const checkboxLabelStyle = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '14px',
  color: '#181818',
  lineHeight: '1.5'
};

export default Register;
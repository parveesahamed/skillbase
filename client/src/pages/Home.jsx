import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiStar, FiBriefcase, FiCheck, FiTrendingUp, FiAward, FiZap, FiClock, FiChevronLeft, FiChevronRight, FiSearch, FiCode, FiCpu, FiSmartphone, FiLayout, FiDatabase, FiServer, FiCloud, FiGitBranch, FiCheckCircle, FiLayers, FiMonitor, FiBarChart, FiEdit2, FiHeadphones, FiDollarSign, FiBookOpen } from 'react-icons/fi';
import heroImg from '../assets/logo/hero-dark-tone-lg.webp';
import skillbridgeImg from '../assets/logo/Skillbridge.png';
import browsematchImg from '../assets/logo/browsematch.png';
import hireImg from '../assets/logo/hire.png';
import payconfidenceImg from '../assets/logo/payconfidence.webp';
import { ReactComponent as BullseyeArrow } from '../assets/logo/bullseye-arrow.svg';
import { ReactComponent as BigDataAnalytics } from '../assets/logo/big-data-analytics.svg';
import { ReactComponent as AngleSmallRight } from '../assets/logo/angle-small-right.svg';
import { ReactComponent as ChipBrain } from '../assets/logo/chip-brain.svg';
import { ReactComponent as CodeSimple } from '../assets/logo/code-simple.svg';
import { ReactComponent as Palette } from '../assets/logo/palette.svg';
import { ReactComponent as HandshakeDeal } from '../assets/logo/handshake-deal-loan.svg';
import { ReactComponent as PenNib } from '../assets/logo/pen-nib.svg';
import { ReactComponent as HrPerson } from '../assets/logo/hr-person.svg';
import { ReactComponent as Bank } from '../assets/logo/bank.svg';
import { ReactComponent as Equality } from '../assets/logo/equality.svg';
import { ReactComponent as Users } from '../assets/logo/users.svg';
import { ReactComponent as Tools } from '../assets/logo/tools.svg';
import { ReactComponent as ChartUser } from '../assets/logo/chart-user.svg';
import { ReactComponent as AiAlgorithm } from '../assets/logo/ai-algorithm.svg';

const Home = () => {
  const navigate = useNavigate();
  const [heroTab, setHeroTab] = useState('hire');
  const [heroSearch, setHeroSearch] = useState('');
  const [howTab, setHowTab] = useState('hire');
  const [stats, setStats] = useState({ students: 0, projects: 0, success: 0, clients: 0 });

  // Animated Counter
  useEffect(() => {
    const targets = { students: 5247, projects: 1893, success: 95, clients: 428 };
    const duration = 2000;
    const steps = 50;
    const increment = {
      students: targets.students / steps,
      projects: targets.projects / steps,
      success: targets.success / steps,
      clients: targets.clients / steps
    };
    
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setStats({
        students: Math.min(Math.floor(increment.students * current), targets.students),
        projects: Math.min(Math.floor(increment.projects * current), targets.projects),
        success: Math.min(Math.floor(increment.success * current), targets.success),
        clients: Math.min(Math.floor(increment.clients * current), targets.clients)
      });
      if (current >= steps) clearInterval(timer);
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    { svg: <BullseyeArrow style={{ width: 40, height: 40, fill: '#5CC858' }} />, title: 'AI-Powered Matching', desc: 'Smart algorithm matches you with projects based on your skills.' },
    { svg: <BigDataAnalytics style={{ width: 40, height: 40, fill: '#5CC858' }} />, title: 'Transparent Scoring', desc: 'See exactly why projects match your profile.' },
    { svg: <ChartUser style={{ width: 40, height: 40, fill: '#5CC858' }} />, title: 'Student-First Design', desc: 'Built specifically for students and academic projects.' },
    { svg: <AiAlgorithm style={{ width: 40, height: 40, fill: '#5CC858' }} />, title: 'MERN + AI Stack', desc: 'Full-stack implementation with AI-based skill matching.' },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ANNOUNCEMENT BANNERS - Upwork Style */}
      <div style={{ maxWidth: '1400px', margin: '40px auto 0', padding: '0 32px' }}>

        {/* Banner 1 — Students / Freelancers (green) */}
        <div style={{
          background: 'linear-gradient(90deg, #d1f7c4 0%, #e8f5e3 40%, #f5fbf2 70%, #fafdfb 100%)',
          borderRadius: '16px',
          padding: '0 32px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', color: '#181818', fontWeight: 550, margin: 0, lineHeight: '19.8px', letterSpacing: '0.36px', flex: 1, paddingRight: '40px' }}>
            Build your portfolio with real projects. Join 5,000+ students on SkillBridge AI.
          </p>
          <Link
            to="/register"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', color: '#181818', fontWeight: 550, textDecoration: 'underline', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '19.8px', letterSpacing: '0.36px' }}
          >
            Get started <AngleSmallRight width={24} height={24} style={{ fill: '#181818', flexShrink: 0, display: 'block' }} />
          </Link>
        </div>


      </div>

      {/* HERO SECTION - Upwork Style */}
      <section style={{ maxWidth: '1400px', margin: '40px auto 0', padding: '0 24px' }}>
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          minHeight: '560px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Background Image */}
          <img
            src={heroImg}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
            }}
          />
          {/* Dark Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(0,30,0,0.65) 0%, rgba(0,30,0,0.35) 50%, rgba(0,0,0,0.1) 100%)',
            zIndex: 2,
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 3, padding: '64px', maxWidth: '680px' }}>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '56px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.5px',
            }}>
              Build your career,<br/>one project at a time
            </h1>

            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.5,
              marginBottom: '36px',
              maxWidth: '520px',
            }}>
              Access real projects ready to help you learn and grow — matched to your skills with AI
            </p>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '10rem',
              padding: '4px',
              marginBottom: '16px',
              maxWidth: '480px',
            }}>
              <button
                onClick={() => setHeroTab('hire')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '10rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  background: heroTab === 'hire' ? '#ffffff' : 'transparent',
                  color: heroTab === 'hire' ? '#181818' : '#ffffff',
                }}
              >
                I want to hire
              </button>
              <button
                onClick={() => setHeroTab('work')}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '10rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  background: heroTab === 'work' ? '#ffffff' : 'transparent',
                  color: heroTab === 'work' ? '#181818' : '#ffffff',
                }}
              >
                I want to work
              </button>
            </div>

            {/* Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: '10rem',
              padding: '6px 6px 6px 20px',
              maxWidth: '480px',
            }}>
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder={heroTab === 'hire' ? 'Describe what you need to hire for...' : 'Search for projects...'}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  color: '#181818',
                  background: 'transparent',
                }}
              />
              <button
                onClick={() => navigate('/browse')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#14A800',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10rem',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              >
                <FiSearch size={16} />
                Search
              </button>
            </div>

            {/* Quick Tags */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
              {['Web design', 'AI development', 'Video editing', 'Google Ads'].map((tag) => (
                <Link
                  key={tag}
                  to="/browse"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '10rem',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {tag} <FiArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>DESIGNED FOR STUDENT SUCCESS</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#181818] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Everything Students Need</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Built specifically for students. Every feature helps you land projects faster.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 transition-all duration-200"
                style={{ border: '2px solid #e5e7eb', boxShadow: 'none' }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '2px solid #181818';
                  e.currentTarget.style.boxShadow = 'inset 0 -4px 0 0 #5CC858';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '2px solid #e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="mb-6">{f.svg ?? <span className="text-4xl">{f.emoji}</span>}</div>
                <h3 className="text-xl font-bold text-[#181818] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIND FREELANCERS */}
      <section className="py-16 bg-white border-t border-[#e5e7eb]">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <h2 className="text-4xl md:text-5xl font-bold text-[#181818] mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Find freelancers for every type of work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[
              { icon: <ChipBrain width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'AI Services' },
              { icon: <CodeSimple width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Development & IT' },
              { icon: <Palette width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Design & Creative' },
              { icon: <HandshakeDeal width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Sales & Marketing' },
              { icon: <PenNib width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Writing & Translation' },
              { icon: <HrPerson width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Admin & Support' },
              { icon: <Bank width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Finance & Accounting' },
              { icon: <Equality width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Legal' },
              { icon: <Users width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'HR & Training' },
              { icon: <Tools width={48} height={48} style={{ fill: '#5CC858' }} />, label: 'Engineering & Architecture' },
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/browse?category=${encodeURIComponent(cat.label)}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  padding: '28px 24px',
                  height: '200px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#14A800'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,168,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div>{cat.icon}</div>
                <span style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '0.48px', lineHeight: '22px', color: '#181818', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-white border-t border-[#e5e7eb]">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '42px', fontWeight: 800, color: '#181818', margin: 0 }}>How it works</h2>
            <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '10rem', padding: '4px', gap: '4px' }}>
              <button
                onClick={() => setHowTab('hire')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10rem',
                  border: howTab === 'hire' ? '1.5px solid #181818' : '1.5px solid transparent',
                  background: howTab === 'hire' ? '#ffffff' : 'transparent',
                  color: '#181818',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >For hiring</button>
              <button
                onClick={() => setHowTab('work')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10rem',
                  border: howTab === 'work' ? '1.5px solid #181818' : '1.5px solid transparent',
                  background: howTab === 'work' ? '#ffffff' : 'transparent',
                  color: '#181818',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >For finding work</button>
            </div>
          </div>

          {/* Image cards above steps — only for hiring tab */}
          {howTab === 'hire' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '28px' }}>
              <div style={{ gridColumn: '1 / 2' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', width: '100%', aspectRatio: '4/3', background: '#f0fdf0' }}>
                  <img
                    src={skillbridgeImg}
                    alt="SkillBridge AI"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                </div>
              </div>
              <div style={{ gridColumn: '2 / 3' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', width: '100%', aspectRatio: '4/3', background: '#f0fdf0' }}>
                  <img
                    src={browsematchImg}
                    alt="Browse Matched Talent"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                </div>
              </div>
              <div style={{ gridColumn: '3 / 4' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', width: '100%', aspectRatio: '4/3', background: '#f0fdf0' }}>
                  <img
                    src={hireImg}
                    alt="Hire & Collaborate"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                </div>
              </div>
              <div style={{ gridColumn: '4 / 5' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', width: '100%', aspectRatio: '4/3', background: '#f0fdf0' }}>
                  <img
                    src={payconfidenceImg}
                    alt="Pay with Confidence"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {(howTab === 'hire' ? [
              { step: '1', title: 'Post a job', desc: 'Tell us what you need. Our platform helps you describe your project and required skills clearly.' },
              { step: '2', title: 'Browse matched talent', desc: 'Our AI instantly surfaces the best-fit student profiles ranked by skill match score.' },
              { step: '3', title: 'Hire & collaborate', desc: 'Hire your top choice and work together through our built-in collaboration tools.' },
              { step: '4', title: 'Pay with confidence', desc: 'Release payment only when you are completely satisfied with the delivered work.' },
            ] : [
              { step: '1', title: 'Create your profile', desc: 'Showcase your skills, projects, and experience to get noticed by the right clients.' },
              { step: '2', title: 'Discover projects', desc: 'Browse AI-matched projects and instantly see your fit score for each opportunity.' },
              { step: '3', title: 'Submit a proposal', desc: 'Apply with confidence — your AI match score tells clients exactly why you are the right pick.' },
              { step: '4', title: 'Earn & grow', desc: 'Complete real-world projects, build your portfolio, and grow your professional reputation.' },
            ]).map((s, i, arr) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < arr.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '23px',
                    left: '56px',
                    right: '-32px',
                    height: '2px',
                    background: '#e5e7eb',
                    zIndex: 0,
                  }} />
                )}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#f2fef0',
                  border: '2px solid #5CC858',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#14A800',
                  marginBottom: '20px',
                }}>{s.step}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 700, color: '#181818', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#5E6D55', lineHeight: '1.7', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

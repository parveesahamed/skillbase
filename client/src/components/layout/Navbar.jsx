import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiArrowRight,
  FiStar,
  FiZap,
  FiMessageSquare,
  FiShield,
  FiBookOpen,
  FiSearch,
  FiHelpCircle,
  FiTrendingUp,
  FiActivity,
  FiCreditCard,
  FiLink,
  FiSettings
} from 'react-icons/fi';

import NotificationBell from '../features/NotificationBell';
import SkillBridgeLogo from '../../assets/logo/SkillBridgeLogo';

const hireCategories = [
  {
    title: 'Admin & support',
    items: ['Cold callers', 'Content moderators', 'Lead generation specialists', 'Personal assistants', 'Virtual assistants']
  },
  {
    title: 'Design & creative',
    items: ['Graphic designers', 'Illustrators', 'Logo designers', 'UX designers', 'Web designers']
  },
  {
    title: 'Marketing',
    items: ['Digital marketers', 'Email marketers', 'Google Ads experts', 'SEO experts', 'Social media managers']
  },
  {
    title: 'Writing & content',
    items: ['Book editors', 'Content writers', 'Copywriters', 'Email copywriters', 'Ghostwriters']
  },
  {
    title: 'AI & emerging tech',
    items: ['Automation engineers', 'Chatbot developers', 'Computer vision engineers', 'Ethical hackers', 'Machine learning engineers']
  },
  {
    title: 'Development & tech',
    items: ['Mobile app developers', 'Python developers', 'Software developers', 'Web developers', 'WordPress developers']
  },
  {
    title: 'Video, audio & animation',
    items: ['Animators', 'Audio editors', 'Music producers', 'Video editors', 'Voice actors']
  }
];

const findWorkCategories = [
  {
    title: 'Admin & support jobs',
    items: ['Chat support jobs', 'Cold calling jobs', 'Content moderation jobs', 'Lead generation jobs', 'Virtual assistant jobs']
  },
  {
    title: 'Design & creative jobs',
    items: ['Canva jobs', 'Graphic design jobs', 'Illustration jobs', 'Logo design jobs', 'Web design jobs']
  },
  {
    title: 'Marketing jobs',
    items: ['Digital marketing jobs', 'Email marketing jobs', 'Google Ads jobs', 'SEO jobs', 'Social media management jobs']
  },
  {
    title: 'Writing & content jobs',
    items: ['Book editing jobs', 'Content writing jobs', 'Copywriting jobs', 'Email copywriting jobs', 'Ghostwriting jobs']
  },
  {
    title: 'AI & emerging tech jobs',
    items: ['AI app development jobs', 'Chatbot development jobs', 'Ethical hacking jobs', 'Machine learning jobs', 'OpenAI jobs']
  },
  {
    title: 'Development & tech jobs',
    items: ['Mobile app development jobs', 'Python jobs', 'Software development jobs', 'Web development jobs', 'WordPress jobs']
  },
  {
    title: 'Video, audio & animation jobs',
    items: ['Animation jobs', 'Audio editing jobs', 'Music production jobs', 'Video editing jobs', 'Voice over jobs']
  }
];

const whyItems = [
  {
    icon: FiStar,
    title: 'Platform Features',
    description: 'AI-powered matching, transparent scoring, student-first design',
    to: '/about'
  },
  {
    icon: FiZap,
    title: 'How It Works',
    description: 'Learn how our AI matching works',
    to: '/how-it-works'
  },
  {
    icon: FiMessageSquare,
    title: 'For Students',
    description: 'Built specifically for student freelancers and academic projects',
    to: '/about'
  },
  {
    icon: FiShield,
    title: 'For Clients',
    description: 'Hire talented students for your projects',
    to: '/about'
  }
];

const whyResources = [
  { label: 'How to Get Started as a Student', to: '/how-it-works' },
  { label: 'How to Hire a Freelancer on SkillBridge AI', to: '/how-it-works' },
  { label: 'How to Use SkillBridge AI as a Freelancer', to: '/how-it-works' }
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hireDropdownOpen, setHireDropdownOpen] = useState(false);
  const [findWorkDropdownOpen, setFindWorkDropdownOpen] = useState(false);
  const [whyDropdownOpen, setWhyDropdownOpen] = useState(false);
  const hireDropdownRef = useRef(null);
  const hireDropdownPanelRef = useRef(null);
  const hireTimeoutRef = useRef(null);
  const findWorkDropdownRef = useRef(null);
  const findWorkDropdownPanelRef = useRef(null);
  const findWorkTimeoutRef = useRef(null);
  const whyDropdownRef = useRef(null);
  const whyDropdownPanelRef = useRef(null);
  const whyTimeoutRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Projects');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [deliverWorkOpen, setDeliverWorkOpen] = useState(false);
  const [manageFinancesOpen, setManageFinancesOpen] = useState(false);
  const [manageWorkOpen, setManageWorkOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);

  // Close logged-in dropdowns when clicking outside
  useEffect(() => {
    const handleDocClick = () => {
      setDeliverWorkOpen(false);
      setManageFinancesOpen(false);
      setManageWorkOpen(false);
      setSearchTypeOpen(false);
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  useEffect(() => {
    return () => {
      if (hireTimeoutRef.current) clearTimeout(hireTimeoutRef.current);
      if (findWorkTimeoutRef.current) clearTimeout(findWorkTimeoutRef.current);
      if (whyTimeoutRef.current) clearTimeout(whyTimeoutRef.current);
    };
  }, []);

  // Close hire dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inButton = hireDropdownRef.current && hireDropdownRef.current.contains(e.target);
      const inPanel = hireDropdownPanelRef.current && hireDropdownPanelRef.current.contains(e.target);
      if (!inButton && !inPanel) {
        setHireDropdownOpen(false);
      }
    };
    if (hireDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hireDropdownOpen]);

  // Close findWork dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inButton = findWorkDropdownRef.current && findWorkDropdownRef.current.contains(e.target);
      const inPanel = findWorkDropdownPanelRef.current && findWorkDropdownPanelRef.current.contains(e.target);
      if (!inButton && !inPanel) {
        setFindWorkDropdownOpen(false);
      }
    };
    if (findWorkDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [findWorkDropdownOpen]);

  // Close why dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inButton = whyDropdownRef.current && whyDropdownRef.current.contains(e.target);
      const inPanel = whyDropdownPanelRef.current && whyDropdownPanelRef.current.contains(e.target);
      if (!inButton && !inPanel) {
        setWhyDropdownOpen(false);
      }
    };
    if (whyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [whyDropdownOpen]);

  const openHireDropdown = () => {
    if (hireTimeoutRef.current) clearTimeout(hireTimeoutRef.current);
    setHireDropdownOpen(true);
  };

  const closeHireDropdown = () => {
    hireTimeoutRef.current = setTimeout(() => setHireDropdownOpen(false), 150);
  };

  const openFindWorkDropdown = () => {
    if (findWorkTimeoutRef.current) clearTimeout(findWorkTimeoutRef.current);
    setFindWorkDropdownOpen(true);
  };

  const closeFindWorkDropdown = () => {
    findWorkTimeoutRef.current = setTimeout(() => setFindWorkDropdownOpen(false), 150);
  };

  const openWhyDropdown = () => {
    if (whyTimeoutRef.current) clearTimeout(whyTimeoutRef.current);
    setWhyDropdownOpen(true);
  };

  const closeWhyDropdown = () => {
    whyTimeoutRef.current = setTimeout(() => setWhyDropdownOpen(false), 150);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50" style={{ position: 'relative', borderBottom: '1px solid #e0e0e0' }}>
      <div className="mx-auto" style={{ maxWidth: '1400px', padding: '0 24px' }}>
        <div className="flex items-center justify-between" style={{ height: '64px' }}>

          {/* Left: Brand + Nav Links */}
          <div className="flex items-center">
            {/* Brand wordmark */}
            <Link to="/" className="shrink-0 flex items-center" style={{ marginRight: '40px' }}>
              <SkillBridgeLogo width={150} height={22} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {user ? (
                user.userType === 'student' ? (
                  <>
                    {/* Find work - mega dropdown */}
                    <div ref={findWorkDropdownRef} onMouseEnter={openFindWorkDropdown} onMouseLeave={closeFindWorkDropdown}>
                      <button className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: findWorkDropdownOpen ? '#14A800' : '#001e00' }}>
                        Find work <FiChevronDown size={12} style={{ transform: findWorkDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                    </div>
                    {/* Deliver work */}
                    <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setDeliverWorkOpen(!deliverWorkOpen)} className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: deliverWorkOpen ? '#14A800' : '#001e00' }}>
                        Deliver work <FiChevronDown size={12} style={{ transform: deliverWorkOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                      {deliverWorkOpen && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: '200px', zIndex: 100, padding: '8px 0' }}>
                          <Link to="/dashboard" onClick={() => setDeliverWorkOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Your dashboard</Link>
                          <Link to="/profile" onClick={() => setDeliverWorkOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>My proposals</Link>
                          <Link to="/dashboard" onClick={() => setDeliverWorkOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>My stats & trends</Link>
                        </div>
                      )}
                    </div>
                    {/* Manage finances */}
                    <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setManageFinancesOpen(!manageFinancesOpen)} className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: manageFinancesOpen ? '#14A800' : '#001e00' }}>
                        Manage finances <FiChevronDown size={12} style={{ transform: manageFinancesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                      {manageFinancesOpen && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: '200px', zIndex: 100, padding: '8px 0' }}>
                          <Link to="/dashboard" onClick={() => setManageFinancesOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Transaction history</Link>
                          <Link to="/dashboard" onClick={() => setManageFinancesOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Reports</Link>
                        </div>
                      )}
                    </div>
                    {/* Messages */}
                    <Link to="/dashboard" className="px-[12px] py-2 text-[14px] font-medium text-[#001e00] hover:text-[#14A800] transition-colors duration-150" style={{ textDecoration: 'none' }}>Messages</Link>
                  </>
                ) : (
                  <>
                    {/* Hire talent - mega dropdown */}
                    <div ref={hireDropdownRef} onMouseEnter={openHireDropdown} onMouseLeave={closeHireDropdown}>
                      <button className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: hireDropdownOpen ? '#14A800' : '#001e00' }}>
                        Hire talent <FiChevronDown size={12} style={{ transform: hireDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                    </div>
                    {/* Manage work */}
                    <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setManageWorkOpen(!manageWorkOpen)} className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: manageWorkOpen ? '#14A800' : '#001e00' }}>
                        Manage work <FiChevronDown size={12} style={{ transform: manageWorkOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                      {manageWorkOpen && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: '200px', zIndex: 100, padding: '8px 0' }}>
                          <Link to="/dashboard" onClick={() => setManageWorkOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>My job postings</Link>
                          <Link to="/dashboard" onClick={() => setManageWorkOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>All contracts</Link>
                          <Link to="/dashboard" onClick={() => setManageWorkOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>All hires</Link>
                        </div>
                      )}
                    </div>
                    {/* Manage finances */}
                    <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setManageFinancesOpen(!manageFinancesOpen)} className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: manageFinancesOpen ? '#14A800' : '#001e00' }}>
                        Manage finances <FiChevronDown size={12} style={{ transform: manageFinancesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                      {manageFinancesOpen && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: '200px', zIndex: 100, padding: '8px 0' }}>
                          <Link to="/dashboard" onClick={() => setManageFinancesOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Transaction history</Link>
                          <Link to="/dashboard" onClick={() => setManageFinancesOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '14px', color: '#001e00', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => e.currentTarget.style.background = '#f3fdf0'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Reports</Link>
                        </div>
                      )}
                    </div>
                    {/* Messages */}
                    <Link to="/dashboard" className="px-[12px] py-2 text-[14px] font-medium text-[#001e00] hover:text-[#14A800] transition-colors duration-150" style={{ textDecoration: 'none' }}>Messages</Link>
                  </>
                )
              ) : (
                <>
                  {/* Hire freelancers with mega dropdown */}
                  <div ref={hireDropdownRef} onMouseEnter={openHireDropdown} onMouseLeave={closeHireDropdown}>
                    <button className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: hireDropdownOpen ? '#14A800' : '#001e00' }}>
                      Hire freelancers <FiChevronDown size={12} style={{ transform: hireDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  {/* Find work with mega dropdown */}
                  <div ref={findWorkDropdownRef} onMouseEnter={openFindWorkDropdown} onMouseLeave={closeFindWorkDropdown}>
                    <button className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: findWorkDropdownOpen ? '#14A800' : '#001e00' }}>
                      Find work <FiChevronDown size={12} style={{ transform: findWorkDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  {/* Why SkillBridge AI with mega dropdown */}
                  <div ref={whyDropdownRef} onMouseEnter={openWhyDropdown} onMouseLeave={closeWhyDropdown}>
                    <button className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium transition-colors duration-150" style={{ background: 'none', border: 'none', cursor: 'pointer', color: whyDropdownOpen ? '#14A800' : '#001e00' }}>
                      Why SkillBridge AI <FiChevronDown size={12} style={{ transform: whyDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                  <Link to="/how-it-works" className="flex items-center gap-[6px] px-[12px] py-2 text-[14px] font-medium text-[#001e00] hover:text-[#14A800] transition-colors duration-150">
                    What's new <FiChevronDown size={12} />
                  </Link>
                  <Link to="/pricing" className="px-[12px] py-2 text-[14px] font-medium text-[#001e00] hover:text-[#14A800] transition-colors duration-150">
                    Pricing
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Auth / Controls */}
          <div className="hidden lg:flex items-center" style={{ gap: '16px' }}>
            {user ? (
              <>
                {/* Search bar - Upwork style */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d5d5d5', borderRadius: '4px', height: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', gap: '8px' }}>
                    <FiSearch size={16} color="#6b7280" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontSize: '14px', width: '160px', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#181818', background: 'transparent' }}
                    />
                  </div>
                  <div style={{ borderLeft: '1px solid #d5d5d5', height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSearchTypeOpen(!searchTypeOpen)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#181818', height: '100%', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {searchType} <FiChevronDown size={11} />
                    </button>
                    {searchTypeOpen && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', minWidth: '140px', zIndex: 101, padding: '8px 0' }}>
                        {(user.userType === 'student' ? ['Projects', 'Students', 'Clients'] : ['Students', 'Projects', 'Jobs']).map((type) => (
                          <button
                            key={type}
                            onClick={() => { setSearchType(type); setSearchTypeOpen(false); }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '14px', color: searchType === type ? '#14A800' : '#001e00', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: searchType === type ? 600 : 400 }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3fdf0'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Help */}
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px', display: 'flex', alignItems: 'center' }}>
                  <FiHelpCircle size={20} />
                </button>
                {/* Notifications */}
                <NotificationBell />
                {/* Profile avatar + dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <div style={{ width: '36px', height: '36px', background: '#14A800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '15px', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', flexShrink: 0 }}>
                      {user.name?.charAt(0).toUpperCase()}
                      {/* Online dot - uses bright lime so it's visible on dark green */}
                      <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '10px', height: '10px', background: onlineStatus ? '#86efac' : '#9ca3af', borderRadius: '50%', border: '2px solid #fff', boxSizing: 'border-box' }} />
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: '300px', background: '#fff', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.16)', border: '1px solid #e5e7eb', zIndex: 200, overflow: 'hidden' }}>
                      {/* Header: avatar + name + badge */}
                      <div style={{ padding: '18px 20px 14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', background: '#14A800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0 }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '15px', fontWeight: 700, color: '#181818', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                            <span style={{ flexShrink: 0, fontSize: '11px', fontWeight: 600, color: '#14A800', background: '#edfae8', borderRadius: '100px', padding: '2px 9px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {user.userType === 'student' ? 'Student' : 'Client'}
                            </span>
                          </div>
                          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', color: '#6b7280', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        </div>
                      </div>

                      {/* Online for messages toggle */}
                      <div style={{ margin: '0 20px 14px 20px', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: onlineStatus ? '#14A800' : '#9ca3af', flexShrink: 0, display: 'inline-block' }} />
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', color: '#374151', fontWeight: 500 }}>Online for messages</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setOnlineStatus(!onlineStatus); }}
                          style={{ width: '44px', height: '24px', borderRadius: '12px', background: onlineStatus ? '#14A800' : '#d1d5db', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, padding: 0 }}
                        >
                          <span style={{ position: 'absolute', top: '4px', left: onlineStatus ? '23px' : '4px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: 'left 0.2s', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </button>
                      </div>

                      {/* Divider */}
                      <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '6px' }} />

                      {/* Menu items */}
                      <div style={{ padding: '4px 0 6px 0' }}>
                        {[
                          { icon: FiUser, label: 'Your profile', to: '/profile' },
                          { icon: FiTrendingUp, label: 'Stats and trends', to: '/dashboard' },
                          { icon: FiActivity, label: 'Account health', to: '/dashboard' },
                          { icon: FiCreditCard, label: 'Membership plan', to: '/pricing' },
                          { icon: FiLink, label: 'Connects', to: '/dashboard' },
                          { icon: FiSettings, label: 'Account settings', to: '/profile' },
                        ].map(({ icon: Icon, label, to }) => (
                          <Link
                            key={label}
                            to={to}
                            onClick={() => setUserDropdownOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', textDecoration: 'none', color: '#181818', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3fdf0'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Icon size={16} color="#6b7280" style={{ flexShrink: 0 }} />
                            {label}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div style={{ borderTop: '1px solid #f0f0f0', padding: '6px 0 8px 0' }}>
                        <button
                          onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', textAlign: 'left' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <FiLogOut size={16} style={{ flexShrink: 0 }} />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NotificationBell />
                <div className="flex items-center" style={{ gap: '20px' }}>
                  <Link to="/login" className="text-[14px] font-medium text-[#001e00] hover:text-[#14A800] transition-colors duration-150">
                    Log in
                  </Link>
                  <Link to="/register" className="text-[14px] bg-[#14A800] text-white rounded-[10rem] hover:bg-[#1dbf00] active:scale-[0.97] font-medium transition-all duration-150" style={{ padding: '8px 20px' }}>
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#001e00] hover:text-[#14A800] transition-colors"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#001e00] hover:bg-gray-50 transition-colors">
                Hire freelancers <FiChevronDown size={13} />
              </Link>
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#001e00] hover:bg-gray-50 transition-colors">
                Find work <FiChevronDown size={13} />
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#001e00] hover:bg-gray-50 transition-colors">
                Why SkillBridge AI <FiChevronDown size={13} />
              </Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#001e00] hover:bg-gray-50 transition-colors">
                What's new <FiChevronDown size={13} />
              </Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#001e00] hover:bg-gray-50 transition-colors">
                Pricing
              </Link>

              <hr className="my-2 border-gray-200" />

              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-[#001e00] hover:bg-gray-50 font-medium">
                    Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-[#001e00] hover:bg-gray-50 font-medium">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2.5 text-sm font-medium text-[#001e00] hover:bg-gray-50 rounded-lg text-center transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-5 py-2.5 text-sm bg-[#14A800] text-white rounded-[20px] text-center font-medium hover:bg-[#1dbf00] active:scale-[0.97] transition-all">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-width Find Work Mega Dropdown */}
      {findWorkDropdownOpen && (
        <div
          ref={findWorkDropdownPanelRef}
          onMouseEnter={openFindWorkDropdown}
          onMouseLeave={closeFindWorkDropdown}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '65px',
            background: '#fff',
            borderTop: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            zIndex: 99
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Top row: 4 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 24px', marginBottom: '36px' }}>
              {findWorkCategories.slice(0, 4).map((cat) => (
                <div key={cat.title}>
                  <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#181818', marginBottom: '14px' }}>{cat.title}</h4>
                  {cat.items.map((item) => (
                    <Link
                      key={item}
                      to="/browse"
                      onClick={() => setFindWorkDropdownOpen(false)}
                      style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#5e6d55', padding: '5px 0', textDecoration: 'none', lineHeight: 1.5 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#14A800'; e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#5e6d55'; e.currentTarget.style.textDecoration = 'none'; }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            {/* Bottom row: 3 columns + links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 24px' }}>
              {findWorkCategories.slice(4, 7).map((cat) => (
                <div key={cat.title}>
                  <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#181818', marginBottom: '14px' }}>{cat.title}</h4>
                  {cat.items.map((item) => (
                    <Link
                      key={item}
                      to="/browse"
                      onClick={() => setFindWorkDropdownOpen(false)}
                      style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#5e6d55', padding: '5px 0', textDecoration: 'none', lineHeight: 1.5 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#14A800'; e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#5e6d55'; e.currentTarget.style.textDecoration = 'none'; }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
              {/* Quick links column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '2px' }}>
                {[
                  { label: 'Explore more', to: '/browse' },
                  { label: 'Ways to earn', to: '/browse' },
                  { label: 'Win work with ads', to: '/browse' },
                  { label: 'Join Freelancer Plus', to: '/register' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setFindWorkDropdownOpen(false)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 500, color: '#14A800', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    {link.label} <FiArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why SkillBridge AI Mega Dropdown */}
      {whyDropdownOpen && (
        <div
          ref={whyDropdownPanelRef}
          onMouseEnter={openWhyDropdown}
          onMouseLeave={closeWhyDropdown}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '65px',
            background: '#fff',
            borderTop: '1px solid #e0e0e0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            zIndex: 99
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {/* Main items — 2×2 grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {whyItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    onClick={() => setWhyDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px', borderRadius: '10px', textDecoration: 'none', background: 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f3fdf0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#edfae8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color="#14A800" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#181818', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', color: '#5e6d55', lineHeight: 1.5 }}>{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* Featured Resources */}
            <div style={{ width: '288px', flexShrink: 0 }}>
              <div style={{ background: '#f7fdf6', borderRadius: '12px', padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <FiBookOpen size={15} color="#14A800" />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, color: '#14A800', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Featured Resources</span>
                </div>
                {whyResources.map((res, idx) => (
                  <Link
                    key={res.label}
                    to={res.to}
                    onClick={() => setWhyDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '11px 0',
                      borderBottom: idx < whyResources.length - 1 ? '1px solid #dff2d8' : 'none',
                      textDecoration: 'none',
                      color: '#181818',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '14px',
                      lineHeight: 1.5,
                      transition: 'color 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#14A800'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#181818'; }}
                  >
                    <FiArrowRight size={14} color="#14A800" style={{ marginTop: '3px', flexShrink: 0 }} />
                    {res.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-width Hire Freelancers Mega Dropdown */}
      {hireDropdownOpen && (
        <div
          ref={hireDropdownPanelRef}
          onMouseEnter={openHireDropdown}
          onMouseLeave={closeHireDropdown}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '65px',
            background: '#fff',
            borderTop: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            zIndex: 99
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Top row: 4 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 24px', marginBottom: '36px' }}>
              {hireCategories.slice(0, 4).map((cat) => (
                <div key={cat.title}>
                  <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#181818', marginBottom: '14px' }}>{cat.title}</h4>
                  {cat.items.map((item) => (
                    <Link
                      key={item}
                      to="/browse"
                      onClick={() => setHireDropdownOpen(false)}
                      style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#5e6d55', padding: '5px 0', textDecoration: 'none', lineHeight: 1.5 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#14A800'; e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#5e6d55'; e.currentTarget.style.textDecoration = 'none'; }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom row: 3 columns + Explore more */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0 24px' }}>
              {hireCategories.slice(4, 7).map((cat) => (
                <div key={cat.title}>
                  <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#181818', marginBottom: '14px' }}>{cat.title}</h4>
                  {cat.items.map((item) => (
                    <Link
                      key={item}
                      to="/browse"
                      onClick={() => setHireDropdownOpen(false)}
                      style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#5e6d55', padding: '5px 0', textDecoration: 'none', lineHeight: 1.5 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#14A800'; e.currentTarget.style.textDecoration = 'underline'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#5e6d55'; e.currentTarget.style.textDecoration = 'none'; }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
              {/* Explore more link */}
              <div>
                <Link
                  to="/browse"
                  onClick={() => setHireDropdownOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#14A800',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Explore more <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

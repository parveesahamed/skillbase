import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiArrowLeft, FiDollarSign, FiClock, FiCalendar, FiUser, FiCheckCircle, FiStar, FiBriefcase, FiMapPin, FiZap, FiXCircle, FiAward, FiTrendingUp, FiExternalLink } from 'react-icons/fi';
import ApplyModal from '../components/projects/ApplyModal';
import ReviewsSection from '../components/trust/ReviewsSection';
import CircularProgress from '../components/animations/CircularProgress';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    if (user && user.userType === 'student') {
      checkApplicationStatus();
      fetchMatchScore();
      fetchStudentProfile();
    }
    fetchSimilarProjects();
    setTimeout(() => setAnimateIn(true), 100);
  }, [id, user]);

  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/project/${id}`);
      setProject(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/application/student', {
        headers: { 'x-auth-token': token }
      });
      const applied = res.data.some(app => app.project._id === id);
      setHasApplied(applied);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatchScore = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/match/projects', {
        headers: { 'x-auth-token': token }
      });
      const matched = res.data.find(p => p._id === id);
      if (matched) setMatchScore(matched.matchScore);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/profile/me', {
        headers: { 'x-auth-token': token }
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Could not fetch student profile for skill gap analysis:', err);
    }
  };

  const fetchSimilarProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/project');
      const similar = res.data.filter(p => p._id !== id).slice(0, 3);
      setSimilarProjects(similar);
    } catch (err) {
      console.error(err);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 75) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getLevelColor = (level) => {
    if (level === 'beginner') return 'bg-green-100 text-green-700';
    if (level === 'intermediate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="text-red-600" size={32}/>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/browse')} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  // Required Skills Analysis (Sr — 70%)
  let skillGapData = null;
  if (user && user.userType === 'student' && profile && project) {
    const profileSkillsNorm = (profile.skills || []).map(s => s.trim().toLowerCase());
    const matched = project.requiredSkills.filter(s =>
      profileSkillsNorm.includes(s.trim().toLowerCase())
    );
    const missing = project.requiredSkills.filter(s =>
      !profileSkillsNorm.includes(s.trim().toLowerCase())
    );
    const total = project.requiredSkills.length;
    const matchPct = total > 0 ? Math.round((matched.length / total) * 100) : 0;
    skillGapData = { matched, missing, total, matchPct };
  }

  // Optional Skills Analysis (So — 20%)
  let optionalSkillsData = null;
  if (user && user.userType === 'student' && profile && project) {
    const profileSkillsNorm = (profile.skills || []).map(s => s.trim().toLowerCase());
    const optional = project.optionalSkills || [];
    const matchedOpt = optional.filter(s => profileSkillsNorm.includes(s.trim().toLowerCase()));
    const missingOpt = optional.filter(s => !profileSkillsNorm.includes(s.trim().toLowerCase()));
    optionalSkillsData = { matched: matchedOpt, missing: missingOpt, total: optional.length };
  }

  // Preference Boost (Pb — 10%)
  const prefBoostApplied =
    user && user.userType === 'student' && project && project.experienceLevel === 'beginner';

  // Score Breakdown — weighted point contributions
  let scoreBreakdown = null;
  if (user && user.userType === 'student' && profile && (profile.skills || []).length > 0 && skillGapData) {
    const srContrib = Math.round(skillGapData.matchPct * 0.70);
    const soContrib =
      optionalSkillsData && optionalSkillsData.total > 0
        ? Math.round((optionalSkillsData.matched.length / optionalSkillsData.total) * 20)
        : 0;
    const pbContrib = prefBoostApplied ? 10 : 0;
    scoreBreakdown = { srContrib, soContrib, pbContrib, total: srContrib + soContrib + pbContrib };
  }

  // Improvement Suggestions — per-missing-skill score impact
  let improvementSuggestions = null;
  if (skillGapData && skillGapData.missing.length > 0 && skillGapData.total > 0) {
    const perSkillImpact = parseFloat(((0.7 / skillGapData.total) * 100).toFixed(1));
    improvementSuggestions = skillGapData.missing.map(skill => ({
      skill,
      impact: perSkillImpact,
      searchUrl: `https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skill)}+tutorial`,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 mb-6 transition-all group animate-slide-in-left">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20}/>
          <span className="font-medium">Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Project Header Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up">
              
              {/* Match Score Badge */}
              {matchScore !== null && (
                <div className="mb-4">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border font-bold ${getMatchColor(matchScore)} animate-bounce-in`}>
                    <FiStar size={16}/>
                    <span>{matchScore}% Match</span>
                  </div>
                </div>
              )}

              {/* Title & Status */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-800 flex-1">{project.title}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${project.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {project.status}
                </span>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
                <div className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiDollarSign className="text-green-600" size={18}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-bold text-gray-800">${project.budget}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiClock className="text-blue-600" size={18}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-bold text-gray-800">{project.duration}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FiBriefcase className="text-yellow-600" size={18}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Level</p>
                    <p className={`font-bold capitalize ${project.experienceLevel === 'beginner' ? 'text-green-600' : project.experienceLevel === 'intermediate' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {project.experienceLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 hover:text-green-600 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="text-purple-600" size={18}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posted</p>
                    <p className="font-bold text-gray-800">{new Date(project.postedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-6">
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <FiBriefcase className="text-green-600"/>
                <span>Project Description</span>
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            {/* Skills Card with Match Visualization */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FiCheckCircle className="text-green-600"/>
                <span>Required Skills</span>
              </h2>
              
              {matchScore !== null && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="flex justify-center mb-4">
                    <CircularProgress 
                      percentage={matchScore} 
                      label="Match Score" 
                      size={100}
                      color="#22c55e"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Your Match Score</span>
                    <span className="text-2xl font-bold text-green-600">{matchScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000 animate-slide-in-left" style={{width: `${matchScore}%`, animationDelay: '0.5s'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Based on your profile skills</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {project.requiredSkills.map((skill, index) => (
                  <div key={index} className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 text-green-700 rounded-xl font-semibold text-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-bounce-in cursor-default" style={{animationDelay: `${index * 0.1}s`}}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Match Analysis — visible to students only */}
            {user && user.userType === 'student' && (
              <div className="glass-card rounded-2xl p-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center space-x-2">
                  <FiZap className="text-yellow-500"/>
                  <span>Skill Match Analysis</span>
                </h2>
                <p className="text-gray-500 text-sm mb-6">Understand exactly how your skills align with this project's requirements.</p>

                {(!profile || !profile.skills || profile.skills.length === 0) ? (
                  /* Warning: profile incomplete */
                  <div className="flex items-start space-x-4 p-5 bg-amber-50 border-2 border-amber-400 rounded-xl">
                    <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 text-2xl font-extrabold leading-none">!</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 text-base mb-1">Profile Incomplete!</h3>
                      <p className="text-amber-700 text-sm mb-3">Please add your skills to your profile to see how well you match this project.</p>
                      <Link
                        to="/edit-profile"
                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-all hover:shadow-md"
                      >
                        Complete Your Profile →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Transparency header */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                      <p className="text-indigo-800 font-semibold text-base">
                        You match{' '}
                        <span className="text-indigo-600 font-extrabold text-lg">{skillGapData.matched.length}</span>
                        {' '}out of{' '}
                        <span className="text-indigo-600 font-extrabold text-lg">{skillGapData.total}</span>
                        {' '}required skills for this project.
                      </p>
                      <div className="w-full bg-indigo-100 rounded-full h-2.5 mt-3 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${skillGapData.matchPct}%`,
                            background: skillGapData.matchPct >= 75 ? '#22c55e' : skillGapData.matchPct >= 50 ? '#eab308' : '#ef4444'
                          }}
                        />
                      </div>
                      <p className="text-xs text-indigo-500 mt-1.5">{skillGapData.matchPct}% skill coverage</p>
                    </div>

                    {/* Matched skills */}
                    {skillGapData.matched.length > 0 && (
                      <div className="mb-5">
                        <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3 flex items-center space-x-1.5">
                          <FiCheckCircle size={14}/>
                          <span>Skills You Have ({skillGapData.matched.length})</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGapData.matched.map((skill, i) => (
                            <span key={i} className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm font-medium">
                              <span className="font-bold text-green-600 text-base leading-none">✓</span>
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills */}
                    {skillGapData.missing.length > 0 && (
                      <div className="mb-5">
                        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center space-x-1.5">
                          <FiXCircle size={14}/>
                          <span>Skills to Learn ({skillGapData.missing.length})</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillGapData.missing.map((skill, i) => (
                            <span key={i} className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium">
                              <span className="font-bold text-gray-400 text-base leading-none">+</span>
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skillGapData.missing.length === 0 && (
                      <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                        <p className="text-green-700 font-semibold text-sm">🎉 You have all the required skills for this project!</p>
                      </div>
                    )}

                    {/* Required Skills footer note */}
                    <div className="p-3 bg-white/60 rounded-lg border border-gray-200 mb-8">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        <span className="font-semibold text-gray-600">Note:</span> These Required Skills represent{' '}
                        <span className="font-bold text-green-600">70%</span>{' '}of your total Match Score calculation.
                      </p>
                    </div>

                    {/* ── Optional Skills (So — 20%) ── */}
                    {optionalSkillsData && optionalSkillsData.total > 0 && (
                      <div className="rounded-xl border border-cyan-200/70 bg-white/50 p-5 mt-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
                        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center space-x-2">
                          <FiStar className="text-cyan-500"/>
                          <span>Bonus / Optional Skills</span>
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">These aren't required, but having them gives you a score boost.</p>

                        {optionalSkillsData.matched.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-bold text-cyan-700 uppercase tracking-wide mb-2">Bonus Skills You Have ({optionalSkillsData.matched.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {optionalSkillsData.matched.map((skill, i) => (
                                <span key={i} className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-50 border border-cyan-300 text-cyan-700 rounded-lg text-sm font-medium">
                                  <span className="text-sm leading-none">⭐</span>
                                  <span>{skill}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {optionalSkillsData.missing.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Other Optional Skills ({optionalSkillsData.missing.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {optionalSkillsData.missing.map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-sm font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-cyan-50/70 rounded-lg border border-cyan-200">
                          <p className="text-xs text-cyan-700 leading-relaxed">
                            <span className="font-semibold">Bonus:</span> Optional skills contribute up to{' '}
                            <span className="font-bold">20%</span>{' '}to your total score.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ── Preference Boost (Pb — 10%) ── */}
                    <div className="rounded-xl border border-purple-200/70 bg-white/50 p-5 mt-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center space-x-2">
                        <FiAward className="text-purple-500"/>
                        <span>Preference Match</span>
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">Compatibility bonuses based on your profile preferences.</p>

                      {prefBoostApplied ? (
                        <div className="mb-4">
                          <span className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-50 border border-purple-300 text-purple-700 rounded-xl text-sm font-semibold">
                            <FiAward size={15}/>
                            <span>Beginner-Friendly Boost Applied (+10%)</span>
                          </span>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <span className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium">
                            No preference boost for this project.
                          </span>
                        </div>
                      )}

                      <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-700 leading-relaxed">
                          <span className="font-semibold">Note:</span> Preferences add up to{' '}
                          <span className="font-bold">10%</span>{' '}to your compatibility score.
                        </p>
                      </div>
                    </div>

                    {/* ── Score Breakdown Summary ── */}
                    {scoreBreakdown && (
                      <div className="rounded-xl border border-gray-200/80 bg-white/50 mt-6 overflow-hidden animate-slide-up" style={{animationDelay: '0.3s'}}>
                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-gray-200/80 bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
                          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                            <span>📊</span>
                            <span>Score Breakdown</span>
                          </h3>
                          <p className="text-gray-500 text-xs mt-0.5">Estimated weighted contribution of each factor to your overall match score.</p>
                        </div>
                        {/* Rows */}
                        <div className="divide-y divide-gray-100/80">
                          <div className="grid grid-cols-3 items-center px-5 py-3.5 animate-fade-in" style={{animationDelay: '0.35s'}}>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FiCheckCircle size={13} className="text-green-500 flex-shrink-0"/>
                              <span>Required Skills</span>
                            </span>
                            <span className="text-center text-sm font-bold text-green-600">{scoreBreakdown.srContrib}%</span>
                            <span className="text-right text-xs text-gray-400 font-medium">of 70%</span>
                          </div>
                          <div className="grid grid-cols-3 items-center px-5 py-3.5 animate-fade-in" style={{animationDelay: '0.4s'}}>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FiStar size={13} className="text-cyan-500 flex-shrink-0"/>
                              <span>Optional Skills</span>
                            </span>
                            <span className="text-center text-sm font-bold text-cyan-600">{scoreBreakdown.soContrib}%</span>
                            <span className="text-right text-xs text-gray-400 font-medium">of 20%</span>
                          </div>
                          <div className="grid grid-cols-3 items-center px-5 py-3.5 animate-fade-in" style={{animationDelay: '0.45s'}}>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <FiAward size={13} className="text-purple-500 flex-shrink-0"/>
                              <span>Preference Boost</span>
                            </span>
                            <span className="text-center text-sm font-bold text-purple-600">{scoreBreakdown.pbContrib}%</span>
                            <span className="text-right text-xs text-gray-400 font-medium">of 10%</span>
                          </div>
                          {/* Total */}
                          <div className="grid grid-cols-3 items-center px-5 py-4 bg-gradient-to-r from-indigo-50/80 to-green-50/80 animate-fade-in" style={{animationDelay: '0.5s'}}>
                            <span className="text-sm font-bold text-gray-800">Estimated Total</span>
                            <span className="text-center font-extrabold text-lg text-indigo-600">{scoreBreakdown.total}%</span>
                            <span className="text-right text-xs text-gray-400 font-medium">of 100%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Recommended Learning Path / Perfect Match ── */}
                    {skillGapData && (
                      skillGapData.missing.length === 0 ? (
                        /* Perfect Match state */
                        <div className="mt-6 rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center animate-slide-up" style={{animationDelay: '0.55s'}}>
                          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiCheckCircle className="text-green-600" size={28}/>
                          </div>
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white text-sm font-bold rounded-full mb-3">
                            🌟 Perfect Match
                          </span>
                          <h3 className="text-lg font-bold text-green-800 mb-1">You have all the required skills!</h3>
                          <p className="text-green-700 text-sm">Your profile is highly competitive for this project. You're in the <span className="font-bold">High Match</span> tier — submit your application now!</p>
                        </div>
                      ) : (
                        /* Improvement suggestions */
                        <div className="mt-6 rounded-xl border border-orange-200/80 bg-white/50 overflow-hidden animate-slide-up" style={{animationDelay: '0.55s'}}>
                          {/* Header */}
                          <div className="px-5 py-4 bg-gradient-to-r from-orange-50/90 to-amber-50/90 border-b border-orange-200/80 flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FiTrendingUp className="text-orange-600" size={18}/>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-base">Recommended Learning Path</h3>
                              <p className="text-gray-500 text-xs">Learn these skills to climb into the High Match tier.</p>
                            </div>
                          </div>

                          {/* Skill rows */}
                          <ul className="divide-y divide-gray-100/80">
                            {improvementSuggestions.map(({ skill, impact, searchUrl }, i) => (
                              <li
                                key={i}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3.5 animate-fade-in"
                                style={{animationDelay: `${0.6 + i * 0.05}s`}}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="mt-0.5 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                                  <p className="text-sm text-gray-700">
                                    Learn{' '}
                                    <span className="font-bold text-gray-900">{skill}</span>
                                    {' '}to increase your match score by{' '}
                                    <span className="font-bold text-green-600">+{impact}%</span>
                                  </p>
                                </div>
                                <a
                                  href={searchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 hover:shadow-sm transition-all flex-shrink-0"
                                >
                                  <FiExternalLink size={12}/>
                                  Find Resources
                                </a>
                              </li>
                            ))}
                          </ul>

                          {/* CTA footer */}
                          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-t border-orange-200/80">
                            <p className="text-sm text-indigo-800 font-medium text-center leading-relaxed">
                              🚀 Mastering these skills will move you into the{' '}
                              <span className="font-bold text-green-600">'High Match' tier</span>{' '}
                              and increase your hiring probability!
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Client Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-slide-in-right">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Posted By</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                  <FiUser className="text-white" size={24}/>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{project.client?.name || 'Client'}</p>
                  <p className="text-sm text-gray-500">{project.client?.email}</p>
                </div>
              </div>
              <Link to={`/profile/${project.client?._id}`} className="block w-full text-center px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg transform hover:scale-105">
                View Profile
              </Link>
            </div>

            {/* Apply Card */}
            {user && user.userType === 'student' && (
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                <p className="text-green-100 text-sm mb-4">Submit your application and stand out from the crowd.</p>
                <button onClick={() => setShowApplyModal(true)} disabled={hasApplied || project.status !== 'open'} className={`w-full py-3 rounded-lg font-bold transition-all transform ${hasApplied ? 'bg-white bg-opacity-20 cursor-not-allowed' : project.status !== 'open' ? 'bg-gray-500 cursor-not-allowed' : 'bg-white text-green-600 hover:bg-opacity-90 hover:shadow-xl hover:scale-105 active:scale-95'}`}>
                  {hasApplied ? '✓ Already Applied' : project.status !== 'open' ? 'Project Closed' : 'Apply Now'}
                </button>
              </div>
            )}

            {/* Project Stats */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Project Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Applications</span>
                  <span className="font-bold text-gray-800">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Views</span>
                  <span className="font-bold text-gray-800">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Category</span>
                  <span className="font-bold text-gray-800 text-sm">{project.category}</span>
                </div>
              </div>
            </div>

            {/* Similar Projects */}
            {similarProjects.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-slide-in-right" style={{animationDelay: '0.3s'}}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Similar Projects</h3>
                <div className="space-y-3">
                  {similarProjects.map((proj, index) => (
                    <Link key={proj._id} to={`/project/${proj._id}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-200 border border-gray-100 transition-all group">
                      <h4 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-green-600 transition-colors">{proj.title}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center space-x-1"><FiDollarSign size={12}/><span>${proj.budget}</span></span>
                        <span className="flex items-center space-x-1"><FiClock size={12}/><span>{proj.duration}</span></span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/browse" className="block mt-4 text-center text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                  View All Projects →
                </Link>
              </div>
            )}

            {/* Similar Projects section ends */}

            {/* Reviews Section - ADD THIS WHOLE BLOCK */}
            <div className="lg:col-span-2 mt-8">
              <ReviewsSection projectId={id} />
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && <ApplyModal project={project} onClose={() => setShowApplyModal(false)} onSuccess={() => { setHasApplied(true); setShowApplyModal(false); }} />}
    </div>
  );
};

export default ProjectDetails;

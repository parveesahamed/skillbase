import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiSearch, FiDollarSign, FiClock, FiUser, FiBookmark, FiCheckCircle, FiArrowRight, FiZap } from 'react-icons/fi';
import MatchScoreCard from '../components/matching/MatchScoreCard';

const Browse = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState('match'); // Default: sort by match score
  const [showHighMatchOnly, setShowHighMatchOnly] = useState(false); // NEW: High-match filter
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchProjects();
    if (user && user.userType === 'student') fetchAppliedProjects();
    setTimeout(() => setAnimateIn(true), 100);
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/match/projects', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setProjects(res.data);
      setFilteredProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAppliedProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/application/student', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setAppliedProjects(res.data.map(app => app.project._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = projects;

    // Apply filters
    if (searchTerm) filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (categoryFilter) filtered = filtered.filter(p => p.category === categoryFilter);
    if (budgetFilter === 'low') filtered = filtered.filter(p => p.budget < 500);
    else if (budgetFilter === 'medium') filtered = filtered.filter(p => p.budget >= 500 && p.budget <= 1500);
    else if (budgetFilter === 'high') filtered = filtered.filter(p => p.budget > 1500);
    if (levelFilter) filtered = filtered.filter(p => p.experienceLevel === levelFilter);

    // High-match filter (students only, matchScore > 70)
    if (showHighMatchOnly) filtered = filtered.filter(p => (p.matchScore || 0) > 70);

    // Apply sorting
    if (sortBy === 'match') {
      filtered = filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'budget-high') {
      filtered = filtered.sort((a, b) => b.budget - a.budget);
    } else if (sortBy === 'budget-low') {
      filtered = filtered.sort((a, b) => a.budget - b.budget);
    } else if (sortBy === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProjects(filtered);
  }, [searchTerm, categoryFilter, budgetFilter, levelFilter, sortBy, showHighMatchOnly, projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Projects</h1>
          <p className="text-gray-600">Find projects matching your skills</p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative group">
              <FiSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-600 transition" size={18}/>
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition" 
              />
            </div>

            {/* Category */}
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Design">Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Marketing">Marketing</option>
            </select>

            {/* Budget */}
            <select 
              value={budgetFilter} 
              onChange={(e) => setBudgetFilter(e.target.value)} 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            >
              <option value="">All Budgets</option>
              <option value="low">Low (&lt; $500)</option>
              <option value="medium">Medium ($500 - $1500)</option>
              <option value="high">High (&gt; $1500)</option>
            </select>

            {/* Level */}
            <select 
              value={levelFilter} 
              onChange={(e) => setLevelFilter(e.target.value)} 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>

            {/* Sort By - NEW */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition font-semibold"
            >
              <option value="">Sort By</option>
              <option value="match">Match Score (Highest First)</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>

          {/* High-Match Toggle — students only */}
          {user && user.userType === 'student' && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  role="switch"
                  aria-checked={showHighMatchOnly}
                  onClick={() => setShowHighMatchOnly(v => !v)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    showHighMatchOnly ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showHighMatchOnly ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <div>
                  <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <FiZap size={14} className={showHighMatchOnly ? 'text-green-500' : 'text-gray-400'}/>
                    Show Only High Matches
                  </span>
                  <p className="text-xs text-gray-500">Only projects where your match score is &gt; 70%</p>
                </div>
              </div>
              {showHighMatchOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-300 text-green-700 rounded-full text-xs font-semibold animate-bounce-in">
                  <FiZap size={11}/>
                  Highly Recommended filter ON
                </span>
              )}
            </div>
          )}
        </div>

        {/* Project Count */}
        <div className="mb-4 flex items-center justify-between animate-fade-in" style={{animationDelay: '0.2s'}}>
          <p className="text-gray-600 text-sm">
            Showing{' '}
            <span className="font-bold text-gray-800">{filteredProjects.length}</span>
            {filteredProjects.length !== projects.length && (
              <span className="text-gray-500"> of <span className="font-semibold text-gray-700">{projects.length}</span></span>
            )}
            {' '}project{filteredProjects.length !== 1 ? 's' : ''}
            {(showHighMatchOnly) && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-medium">
                <FiZap size={10}/> High Match only
              </span>
            )}
          </p>
          {filteredProjects.length !== projects.length && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setBudgetFilter('');
                setLevelFilter('');
                setShowHighMatchOnly(false);
                setSortBy('match');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const hasApplied = appliedProjects.includes(project._id);
            // Pass matchScore directly — null/undefined renders "Calculating" state in the component
            const matchScore = project.matchScore;

            return (
              <Link 
                key={project._id} 
                to={`/project/${project._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group block" 
                style={{animationDelay: `${0.1 * (index % 6)}s`}}
              >
                <div className="p-6 relative">

                  {/* Match Score — always visible; shows Calculating when matchScore is null */}
                  {/* z-20: above card content (z-0), safely below modals/dropdowns (z-40+) */}
                  {/* scale-[0.80] on mobile (-20%), scale-90 on sm, full on md+ */}
                  <div className="absolute top-3 right-3 z-20 origin-top-right scale-[0.80] sm:scale-90 md:scale-100">
                    <MatchScoreCard
                      score={matchScore}
                      breakdown={project.matchBreakdown}
                      size="small"
                      animationDelay={`${(0.1 * (index % 6) + 0.2).toFixed(2)}s`}
                    />
                  </div>

                  {/* Applied Badge */}
                  {hasApplied && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs font-medium animate-bounce-in shadow-sm">
                        <FiCheckCircle size={12}/>
                        <span>Applied</span>
                      </div>
                    </div>
                  )}

                  {/* mt-24 mobile (badge scaled ~75px + 12px top offset = ~87px), mt-28 desktop (full ~106px) */}
                  <div className="mt-24 md:mt-28">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.requiredSkills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1 bg-gradient-to-r from-green-50 to-teal-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.requiredSkills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                          +{project.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                        <FiDollarSign size={14}/>
                        <span className="font-semibold">${project.budget}</span>
                      </div>
                      <div className="flex items-center space-x-1 hover:text-green-600 transition-colors">
                        <FiClock size={14}/>
                        <span>{project.duration}</span>
                      </div>
                      <div className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium capitalize">
                        {project.experienceLevel}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <FiUser size={12}/>
                        <span className="font-medium text-gray-700">{project.client?.name || 'Client'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <FiArrowRight size={14}/>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-gray-400" size={32}/>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;

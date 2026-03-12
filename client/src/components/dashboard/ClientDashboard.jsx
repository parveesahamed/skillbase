import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiCheckCircle, FiXCircle, FiPlus, FiDollarSign, FiClock, FiStar } from 'react-icons/fi';
import PostProjectModal from '../projects/PostProjectModal';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    fetchProjects();
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/application/client-projects', {
        headers: { 'x-auth-token': token }
      });
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchApplications = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/application/project/${projectId}`, {
        headers: { 'x-auth-token': token }
      });
      setApplications(res.data);
      setSelectedProject(projectId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/application/${applicationId}`, { status }, {
        headers: { 'x-auth-token': token }
      });
      fetchApplications(selectedProject);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {user.name}! 👋</h1>
            <p className="text-gray-600">Manage your projects and find talented students</p>
          </div>
          <button onClick={() => setShowPostModal(true)} className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-xl transform hover:scale-105 btn-ripple">
            <FiPlus size={20}/><span>Post New Project</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'My Projects', value: projects.length, icon: <FiBriefcase size={24}/>, color: 'bg-green-100 text-green-600', bg: 'from-green-50 to-green-100' },
            { label: 'Total Applications', value: projects.reduce((sum, p) => sum + (p.applicationCount || 0), 0), icon: <FiUsers size={24}/>, color: 'bg-blue-100 text-blue-600', bg: 'from-blue-50 to-blue-100' },
            { label: 'Open Projects', value: projects.filter(p => p.status === 'open').length, icon: <FiCheckCircle size={24}/>, color: 'bg-yellow-100 text-yellow-600', bg: 'from-yellow-50 to-yellow-100' },
          ].map((card, i) => (
            <div key={i} className={`bg-gradient-to-br ${card.bg} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-scale-in group cursor-pointer`} style={{animationDelay: `${i * 0.1}s`}}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>{card.icon}</div>
                <p className="text-3xl font-bold text-gray-800 group-hover:scale-110 transition-transform">{card.value}</p>
              </div>
              <p className="text-gray-600 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Projects & Applications */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Projects List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 animate-slide-in-left" style={{animationDelay: '0.2s'}}>My Projects</h2>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase className="text-gray-400" size={32}/>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Yet</h3>
                <p className="text-gray-600 mb-6">Post your first project to start hiring students!</p>
                <button onClick={() => setShowPostModal(true)} className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:shadow-lg transform hover:scale-105">
                  <FiPlus/><span>Post Project</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project, i) => (
                  <div key={project._id} onClick={() => fetchApplications(project._id)} className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1 animate-slide-up group ${selectedProject === project._id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200'}`} style={{animationDelay: `${i * 0.1}s`}}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${project.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{project.status}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-green-100 hover:text-green-700 transition-all">{skill}</span>
                      ))}
                      {project.requiredSkills.length > 3 && <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">+{project.requiredSkills.length - 3}</span>}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600"><FiDollarSign size={14}/><span className="font-semibold">${project.budget}</span></div>
                      <div className="flex items-center space-x-1 text-gray-600"><FiUsers size={14}/><span className="font-semibold">{project.applicationCount || 0}</span><span className="text-gray-500">applications</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 animate-slide-in-right" style={{animationDelay: '0.3s'}}>Applications</h2>
            {!selectedProject ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="text-gray-400" size={32}/>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Select a Project</h3>
                <p className="text-gray-600 text-sm">Click on a project to view applications</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="text-gray-400" size={32}/>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 text-sm">Students haven't applied to this project yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app, i) => (
                  <div key={app._id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up" style={{animationDelay: `${i * 0.1}s`}}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{app.student.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <FiStar className={`${getMatchColor(app.matchScore || 0)}`} size={16}/>
                          <span className={`font-bold text-sm ${getMatchColor(app.matchScore || 0)}`}>{app.matchScore || 0}% Match</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <FiDollarSign size={14}/><span className="font-semibold">${app.proposedBudget}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 italic">"{app.coverLetter}"</p>
                    {app.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleUpdateStatus(app._id, 'accepted')} className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:shadow-lg transform hover:scale-105 btn-ripple">
                          <FiCheckCircle size={16}/><span>Accept</span>
                        </button>
                        <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all hover:shadow-lg transform hover:scale-105 btn-ripple">
                          <FiXCircle size={16}/><span>Reject</span>
                        </button>
                      </div>
                    )}
                    {app.status !== 'pending' && (
                      <div className={`text-center py-2 rounded-lg font-bold capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {app.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPostModal && <PostProjectModal onClose={() => setShowPostModal(false)} onSuccess={fetchProjects} />}
    </div>
  );
};

export default ClientDashboard;

import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiDollarSign, FiClock, Fibriefcase } from 'react-icons/fi';

const PostProjectModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    requiredSkills: '',
    budget: '',
    duration: '1 week',
    experienceLevel: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.description || !formData.requiredSkills || !formData.budget) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/project', formData, {
        headers: { 'x-auth-token': token }
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to post project');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Post New Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:rotate-90 duration-300">
            <FiX size={24} className="text-gray-600"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-down">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., E-commerce Website Development"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project in detail..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
              required
            />
          </div>

          {/* Category */}
          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Design">Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Entry">Data Entry</option>
              <option value="Video Editing">Video Editing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Required Skills */}
          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills *</label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
          </div>

          {/* Budget & Duration */}
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Budget */}
            <div className="animate-slide-up" style={{animationDelay: '0.5s'}}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget ($) *</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="animate-slide-up" style={{animationDelay: '0.6s'}}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all appearance-none"
                >
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                  <option value="2 months">2 Months</option>
                  <option value="3+ months">3+ Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div className="animate-slide-up" style={{animationDelay: '0.7s'}}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'expert'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({...formData, experienceLevel: level})}
                  className={`px-4 py-3 rounded-lg font-medium capitalize transition-all transform hover:scale-105 ${
                    formData.experienceLevel === level
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </span>
              ) : (
                'Post Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProjectModal;

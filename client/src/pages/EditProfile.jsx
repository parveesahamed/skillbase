import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import ResumeUpload from '../components/profile/ResumeUpload';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    portfolio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Merge skills extracted from resume into the skills text field,
  // deduplicating case-insensitively against what's already entered.
  const mergeExtractedSkills = (newSkills) => {
    const existing = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const existingLower = existing.map(s => s.toLowerCase());
    const additions = newSkills.filter(s => !existingLower.includes(s.toLowerCase()));
    const merged = [...existing, ...additions].join(', ');
    setFormData(prev => ({ ...prev, skills: merged }));
    setSuccess(`${additions.length} skill${additions.length !== 1 ? 's' : ''} added from your resume!`);
    setTimeout(() => setSuccess(''), 4000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/profile/me', {
        headers: { 'x-auth-token': token }
      });
      setFormData({
        bio: res.data.bio || '',
        skills: res.data.skills?.join(', ') || '',
        portfolio: res.data.portfolio || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/profile', formData, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-800">Edit Profile</h1>
            <button onClick={() => navigate('/profile')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all">
              <FiX size={24}/>
            </button>
          </div>
          <p className="text-gray-600">Update your profile information to get better project matches</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-down">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 animate-slide-down">
              {success}
            </div>
          )}

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
          </div>

          {/* Resume Upload */}
          <ResumeUpload onSkillsConfirmed={mergeExtractedSkills} />

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills *</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, Python, Design (comma separated)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate skills with commas. These will be used for project matching.</p>
          </div>

          {/* Portfolio */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Portfolio URL</label>
            <input
              type="url"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">Link to your portfolio, GitHub, or personal website</p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave size={18}/>
                  <span>Save Profile</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

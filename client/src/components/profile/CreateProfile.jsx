import React, { useState } from 'react';
import API from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateProfile = () => {
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    portfolio: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await API.post('/profile', formData);
      setSuccess('Profile created successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">Help us match you with the perfect projects</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Tell us about yourself, your interests, and goals..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Skills * (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g., HTML, CSS, JavaScript, Python, React"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas. This helps us match you with projects!</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Portfolio URL</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition text-lg"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
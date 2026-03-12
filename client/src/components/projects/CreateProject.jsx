import React, { useState } from 'react';
import API from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    requiredSkills: '',
    budget: '',
    duration: '',
    experienceLevel: 'beginner'
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
      await API.post('/project', formData);
      setSuccess('Project created successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Post a New Project</h2>

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
              <label className="block text-gray-700 font-medium mb-2">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g., Build a responsive website"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Describe your project requirements in detail..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                >
                  <option>Web Development</option>
                  <option>Mobile Apps</option>
                  <option>UI/UX Design</option>
                  <option>Data Science</option>
                  <option>Content Writing</option>
                  <option>Digital Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Required Skills * (comma-separated)</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g., HTML, CSS, JavaScript, React"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Budget (USD) *</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., 2 weeks, 1 month"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition text-lg"
            >
              Post Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
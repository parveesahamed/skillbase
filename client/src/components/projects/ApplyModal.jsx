import React, { useState } from 'react';
import API from '../../utils/api';
import { FiX, FiSend } from 'react-icons/fi';

const ApplyModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedBudget: project.budget
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/application', {
        projectId: project._id,
        coverLetter: formData.coverLetter,
        proposedBudget: formData.proposedBudget
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Apply for Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        {/* Project Info */}
        <div className="p-6 bg-gray-50 mx-6 mt-4 rounded-lg">
          <h3 className="font-bold text-gray-800">{project.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {project.requiredSkills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700">
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Budget: ${project.budget} | Duration: {project.duration}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Cover Letter *</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
              placeholder="Tell the client why you are the best fit for this project..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Your Proposed Budget ($)</label>
            <input
              type="number"
              name="proposedBudget"
              value={formData.proposedBudget}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition font-medium disabled:opacity-50"
            >
              <FiSend />
              <span>{loading ? 'Sending...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;

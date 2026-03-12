import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiFileText, FiX, FiCheck, FiPlus, FiAlertTriangle, FiZap } from 'react-icons/fi';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// ── Skill Preview Modal ────────────────────────────────────────────────────────
const SkillPreviewModal = ({ skills: initialSkills, onConfirm, onClose }) => {
  const [skills, setSkills] = useState([...initialSkills]);
  const [newSkill, setNewSkill] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const removeSkill = (i) => setSkills(s => s.filter((_, idx) => idx !== i));

  const startEdit = (i) => {
    setEditIndex(i);
    setEditValue(skills[i]);
  };

  const commitEdit = () => {
    if (editValue.trim()) {
      setSkills(s => s.map((sk, i) => (i === editIndex ? editValue.trim() : sk)));
    }
    setEditIndex(null);
    setEditValue('');
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(s => [...s, trimmed]);
    }
    setNewSkill('');
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') { e.preventDefault(); action(); }
    if (e.key === 'Escape' && editIndex !== null) { setEditIndex(null); setEditValue(''); }
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass-card rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FiZap className="text-green-600" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Extracted Skills</h2>
              <p className="text-gray-500 text-xs">Review, edit, or add before saving to your profile.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Skill chips */}
        <div className="px-6 py-5 max-h-64 overflow-y-auto">
          {skills.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No skills left. Add them manually below.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="flex items-center gap-1 group">
                  {editIndex === i ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={e => handleKeyDown(e, commitEdit)}
                      className="px-2 py-1 text-sm border-2 border-green-400 rounded-lg outline-none w-32"
                    />
                  ) : (
                    <span
                      onClick={() => startEdit(i)}
                      title="Click to edit"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-green-100 transition-colors"
                    >
                      <FiCheck size={11} />
                      {skill}
                    </span>
                  )}
                  <button
                    onClick={() => removeSkill(i)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove skill"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add new skill */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => handleKeyDown(e, addSkill)}
              placeholder="Add a skill manually..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
            />
            <button
              onClick={addSkill}
              disabled={!newSkill.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <FiPlus size={14} /> Add
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Click a skill chip to edit it inline. Press Enter to confirm.</p>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3 border-t border-white/30 pt-4">
          <button
            onClick={() => onConfirm(skills)}
            disabled={skills.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
          >
            <FiCheck size={16} />
            Save {skills.length} Skill{skills.length !== 1 ? 's' : ''} to Profile
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ResumeUpload component ────────────────────────────────────────────────
const ResumeUpload = ({ onSkillsConfirmed }) => {
  const [dragOver, setDragOver] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [extractedSkills, setExtractedSkills] = useState(null); // null = not scanned yet
  const [noSkillsFound, setNoSkillsFound] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    if (file.type !== 'application/pdf') return 'Only PDF files are accepted.';
    if (file.size > MAX_SIZE_BYTES) return `File is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`;
    return null;
  };

  const uploadFile = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    setError('');
    setNoSkillsFound(false);
    setScanning(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.extractedSkills.length === 0) {
        setNoSkillsFound(true);
      } else {
        setExtractedSkills(res.data.extractedSkills);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    } finally {
      setScanning(false);
      // Reset file input so the same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = '';
    }
  }, []);

  // Drag-and-drop handlers
  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = ()  => setDragOver(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleConfirm = (skills) => {
    setExtractedSkills(null);
    onSkillsConfirmed(skills);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <FiUploadCloud size={15} className="text-indigo-500" />
            Upload Resume (PDF)
            <span className="text-xs font-normal text-gray-400 ml-1">— auto-extract skills</span>
          </label>
          <span className="text-xs text-gray-400">Max {MAX_SIZE_MB} MB · PDF only</span>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => !scanning && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`
            relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer
            transition-all duration-300
            ${scanning
              ? 'border-indigo-300 bg-indigo-50/60 cursor-default'
              : dragOver
                ? 'border-green-400 bg-green-50/70 scale-[1.01]'
                : 'border-gray-300 bg-white/60 hover:border-indigo-400 hover:bg-indigo-50/40'}
          `}
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          {scanning ? (
            /* Scanning state */
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="relative w-14 h-14">
                <div className="w-14 h-14 border-4 border-indigo-200 rounded-full" />
                <div className="absolute inset-0 w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <FiFileText className="absolute inset-0 m-auto text-indigo-500" size={18} />
              </div>
              <div>
                <p className="font-semibold text-indigo-700 text-sm">Scanning Resume…</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{fileName}</p>
              </div>
              <div className="flex gap-1 mt-1">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          ) : (
            /* Idle / drop state */
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${dragOver ? 'bg-green-100' : 'bg-indigo-50'}`}>
                <FiUploadCloud size={28} className={dragOver ? 'text-green-600' : 'text-indigo-500'} />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">
                  {dragOver ? 'Drop your PDF here' : 'Drag & drop your resume here'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">or <span className="text-indigo-600 font-medium underline">click to browse</span></p>
              </div>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
            <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={15} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* No skills found prompt */}
        {noSkillsFound && !error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-300 rounded-lg animate-slide-down">
            <FiAlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={15} />
            <p className="text-sm text-amber-800">
              No recognisable skills were found in your resume.
              <span className="block text-amber-700 text-xs mt-0.5">Please add your skills manually using the field below.</span>
            </p>
          </div>
        )}
      </div>

      {/* Skill Preview Modal */}
      {extractedSkills && (
        <SkillPreviewModal
          skills={extractedSkills}
          onConfirm={handleConfirm}
          onClose={() => setExtractedSkills(null)}
        />
      )}
    </>
  );
};

export default ResumeUpload;

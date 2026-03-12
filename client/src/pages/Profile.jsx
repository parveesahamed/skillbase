import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiArrowLeft, FiMail, FiUser, FiEdit, FiCheckCircle, FiStar, FiBriefcase, FiAward, FiCalendar, FiExternalLink } from 'react-icons/fi';
import { VerificationBadge, RatingStars, ResponseTimeBadge } from '../components/trust/TrustBadges';
import CircularProgress from '../components/animations/CircularProgress';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    } else if (user) {
      fetchProfile(user.id);
      setIsOwnProfile(true);
    }
    setTimeout(() => setAnimateIn(true), 100);
  }, [id, user]);

  const fetchProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const [profileRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/profile/user/${userId}`, {
          headers: { 'x-auth-token': token }
        }),
        axios.get(`http://localhost:5000/api/auth/user`, {
          headers: { 'x-auth-token': token }
        })
      ]);
      setProfile(profileRes.data);
      setProfileUser(profileRes.data.user);
      if (user && profileRes.data.user._id === user.id) setIsOwnProfile(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-red-600" size={32}/>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">This user hasn't created a profile yet.</p>
          {isOwnProfile && (
            <Link to="/profile/create" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
              Create Profile
            </Link>
          )}
          <button onClick={() => navigate(-1)} className="ml-3 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
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
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center animate-slide-in-left">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiUser className="text-white" size={48}/>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileUser?.name}</h2>

              <div className="flex flex-col items-center gap-2 mb-3">
                <VerificationBadge type="student" verified={true} />
                <RatingStars rating={4.5} showNumber={true} />
                <ResponseTimeBadge time="2h" />
              </div>

              <p className="text-gray-500 mb-4">{profileUser?.email}</p>

              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold capitalize mb-6">
                {profileUser?.userType}
              </div>
              
              {isOwnProfile && (
                <Link to="/profile/edit" className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:shadow-lg transform hover:scale-105 font-semibold flex items-center justify-center space-x-2">
                  <FiEdit size={18}/>
                  <span>Edit Profile</span>
                </Link>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Stats</h3>

              <div className="flex justify-center mb-6">
                <CircularProgress 
                  percentage={95} 
                  label="Profile Complete" 
                  size={120}
                  color="#22c55e"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiBriefcase className="text-green-600" size={16}/>
                    </div>
                    <span className="text-gray-600 text-sm">Completed</span>
                  </div>
                  <span className="font-bold text-gray-800">{profile.completedProjects || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FiStar className="text-yellow-600" size={16}/>
                    </div>
                    <span className="text-gray-600 text-sm">Rating</span>
                  </div>
                  <span className="font-bold text-gray-800">{profile.rating?.toFixed(1) || '0.0'} / 5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="text-blue-600" size={16}/>
                    </div>
                    <span className="text-gray-600 text-sm">Skills</span>
                  </div>
                  <span className="font-bold text-gray-800">{profile.skills?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contact</h3>
              <div className="space-y-3">
                <a href={`mailto:${profileUser?.email}`} className="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-all group">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-all">
                    <FiMail className="group-hover:text-green-600" size={18}/>
                  </div>
                  <span className="text-sm">{profileUser?.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio Card */}
            {profile.bio && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <FiUser className="text-green-600"/>
                  <span>About</span>
                </h2>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Skills Card */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <FiCheckCircle className="text-green-600"/>
                  <span>Skills</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="px-4 py-2.5 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 text-green-700 rounded-xl font-semibold text-sm hover:shadow-md hover:scale-105 transition-all duration-300 animate-bounce-in cursor-default" style={{animationDelay: `${index * 0.05}s`}}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Card */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <FiAward className="text-green-600"/>
                  <span>Education</span>
                </h2>
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-all">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{edu.degree}</h3>
                      <p className="text-green-600 font-medium mb-2">{edu.school}</p>
                      {edu.fieldOfStudy && <p className="text-gray-600 text-sm mb-2">{edu.fieldOfStudy}</p>}
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <FiCalendar size={14}/>
                        <span>{new Date(edu.from).getFullYear()} - {edu.current ? 'Present' : new Date(edu.to).getFullYear()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Card */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <FiBriefcase className="text-green-600"/>
                  <span>Experience</span>
                </h2>
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-all">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{exp.title}</h3>
                      <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
                      {exp.location && <p className="text-gray-600 text-sm mb-2">{exp.location}</p>}
                      {exp.description && <p className="text-gray-700 text-sm mb-3 leading-relaxed">{exp.description}</p>}
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <FiCalendar size={14}/>
                        <span>{new Date(exp.from).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.to).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Card */}
            {profile.portfolio && (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <FiExternalLink className="text-green-600"/>
                  <span>Portfolio</span>
                </h2>
                <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-all hover:underline group">
                  <span>{profile.portfolio}</span>
                  <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16}/>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

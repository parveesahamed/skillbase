import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import logo from '../../assets/logo/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand — left column */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SkillBridge AI" className="h-8 w-auto object-contain" />
              <span className="text-lg font-semibold text-white leading-none">
                SkillBridge<span className="text-indigo-400 ml-1">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering students to gain real-world experience through skill-based freelance projects.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiGithub size={18} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiLinkedin size={18} /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><FiTwitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/browse" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Projects</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For Students */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">For Students</h4>
            <ul className="space-y-2.5">
              <li><Link to="/register" className="text-sm text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/success-stories" className="text-sm text-gray-400 hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link to="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-500">&copy; 2025 SkillBridge AI. All rights reserved. Built by Parvees Ahamed</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
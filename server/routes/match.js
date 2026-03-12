const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const Project = require('../models/Project');

// Computes a 3-part match breakdown for a student profile against a project:
//   Sr = required skill match %    (weight 0.7)
//   So = skill overlap %           (weight 0.2)
//   Pb = profile boost %           (weight 0.1)
function computeMatchBreakdown(profile, project) {
  const projectSkills = project.requiredSkills || [];
  const studentSkills = profile.skills || [];

  // Sr — what fraction of REQUIRED skills does the student have?
  const matchingSkills = projectSkills.filter(skill =>
    studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );
  const Sr = projectSkills.length > 0
    ? Math.round((matchingSkills.length / projectSkills.length) * 100)
    : 0;

  // So — what fraction of the STUDENT'S skills are relevant to this project?
  const relevantStudentSkills = studentSkills.filter(skill =>
    projectSkills.some(ps => ps.toLowerCase() === skill.toLowerCase())
  );
  const So = studentSkills.length > 0
    ? Math.round((relevantStudentSkills.length / studentSkills.length) * 100)
    : 0;

  // Pb — profile completeness & strength (0-100)
  let Pb = 0;
  if (profile.bio && profile.bio.trim().length > 0) Pb += 25;
  if (profile.portfolio && profile.portfolio.trim().length > 0) Pb += 25;
  if (profile.experience && profile.experience.length > 0) Pb += 20;
  if (profile.completedProjects > 0) Pb += Math.min(profile.completedProjects * 5, 15);
  if (profile.rating > 0) Pb += Math.min(Math.round(profile.rating * 3), 15);
  Pb = Math.min(Pb, 100);

  const finalScore = Math.round(Sr * 0.7 + So * 0.2 + Pb * 0.1);

  return { matchScore: finalScore, matchingSkills, breakdown: { Sr, So, Pb } };
}

router.get('/projects', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({ msg: 'Please create a profile first' });
    }

    const projects = await Project.find({ status: 'open' }).populate('client', ['name', 'email']);

    const matchedProjects = projects.map(project => {
      const { matchScore, matchingSkills, breakdown } = computeMatchBreakdown(profile, project);
      return {
        ...project.toObject(),
        matchScore,
        matchingSkills,
        matchBreakdown: breakdown,
      };
    });

    matchedProjects.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matchedProjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/students/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const profiles = await Profile.find().populate('user', ['name', 'email', 'userType']);
    const studentProfiles = profiles.filter(profile => profile.user && profile.user.userType === 'student');

    const matchedStudents = studentProfiles.map(profile => {
      const { matchScore, matchingSkills, breakdown } = computeMatchBreakdown(profile, project);
      return {
        ...profile.toObject(),
        matchScore,
        matchingSkills,
        matchBreakdown: breakdown,
      };
    });

    matchedStudents.sort((a, b) => b.matchScore - a.matchScore);
    res.json(matchedStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
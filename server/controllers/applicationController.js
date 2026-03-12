const Application = require('../models/Application');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createApplication = async (req, res) => {
  const { projectId, coverLetter, proposedBudget } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.userType !== 'student') {
      return res.status(403).json({ msg: 'Only students can apply' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const existingApp = await Application.findOne({ project: projectId, student: req.user.id });
    if (existingApp) {
      return res.status(400).json({ msg: 'Already applied for this project' });
    }

    // Calculate match score at time of application
    let matchScore = 0;
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile && profile.skills && project.requiredSkills.length > 0) {
      const matched = project.requiredSkills.filter(skill =>
        profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      );
      matchScore = Math.round((matched.length / project.requiredSkills.length) * 100);
    }

    const newApplication = new Application({
      project: projectId,
      student: req.user.id,
      coverLetter,
      proposedBudget: Number(proposedBudget),
      matchScore,
    });

    const application = await newApplication.save();
    await application.populate('project', ['title', 'requiredSkills', 'budget']);
    await application.populate('student', ['name', 'email']);

    // Notify the project owner (client) about the new application
    await new Notification({
      user: project.client,
      type: 'application',
      message: `${user.name} applied for your project "${project.title}"`,
      data: { projectId: project._id, applicationId: application._id, studentId: user._id },
    }).save();

    res.json(application);
  } catch (err) {
    console.error('Create application error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('project', ['title', 'description', 'requiredSkills', 'budget', 'duration', 'category', 'experienceLevel', 'client'])
      .populate('student', ['name', 'email'])
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('Get student apps error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getProjectApplications = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const applications = await Application.find({ project: req.params.projectId })
      .populate('student', ['name', 'email'])
      .sort({ appliedAt: -1 });

    const applicationsWithScore = await Promise.all(
      applications.map(async (app) => {
        const profile = await Profile.findOne({ user: app.student._id });
        let matchScore = 0;
        let matchingSkills = [];

        if (profile && profile.skills) {
          matchingSkills = project.requiredSkills.filter(skill =>
            profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())
          );
          matchScore = project.requiredSkills.length > 0
            ? Math.round((matchingSkills.length / project.requiredSkills.length) * 100)
            : 0;
        }

        return { ...app.toObject(), matchScore, matchingSkills };
      })
    );

    applicationsWithScore.sort((a, b) => b.matchScore - a.matchScore);
    res.json(applicationsWithScore);
  } catch (err) {
    console.error('Get project apps error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const application = await Application.findById(req.params.id).populate('project');
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    if (application.project.client.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    if (status === 'accepted') {
      await Project.findByIdAndUpdate(application.project._id, { status: 'in-progress' });
    }

    // Notify the student about status change
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
    await new Notification({
      user: application.student,
      type: 'status_change',
      message: `Your application for "${application.project.title}" has been ${statusLabel}`,
      data: { projectId: application.project._id, applicationId: application._id },
    }).save();

    res.json(application);
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id }).sort({ postedAt: -1 });

    const projectsWithCount = await Promise.all(
      projects.map(async (project) => {
        const appCount = await Application.countDocuments({ project: project._id });
        return { ...project.toObject(), applicationCount: appCount };
      })
    );

    res.json(projectsWithCount);
  } catch (err) {
    console.error('Get client projects error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
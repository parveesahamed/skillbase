const Project = require('../models/Project');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', ['name', 'email'])
      .sort({ postedAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Get all projects error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', ['name', 'email']);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Get project error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Create project
exports.createProject = async (req, res) => {
  const { title, description, category, requiredSkills, budget, duration, experienceLevel } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !category || !requiredSkills || !budget || !duration) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Check if user is a client
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.userType !== 'client') {
      return res.status(403).json({ msg: 'Only clients can post projects' });
    }

    // Process skills array
    let skillsArray = requiredSkills;
    if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }

    const newProject = new Project({
      client: req.user.id,
      title,
      description,
      category,
      requiredSkills: skillsArray,
      budget: Number(budget),
      duration,
      experienceLevel: experienceLevel || 'beginner'
    });

    const project = await newProject.save();
    
    // Populate client info before sending response
    await project.populate('client', ['name', 'email']);

    // Notify high-match students about this new project
    try {
      const profiles = await Profile.find().populate('user', ['name', 'userType']);
      const studentProfiles = profiles.filter(p => p.user && p.user.userType === 'student');

      for (const profile of studentProfiles) {
        const matchingSkills = skillsArray.filter(skill =>
          profile.skills.some(s => s.toLowerCase() === skill.toLowerCase())
        );
        const matchScore = skillsArray.length > 0
          ? Math.round((matchingSkills.length / skillsArray.length) * 100)
          : 0;

        if (matchScore >= 70) {
          await new Notification({
            user: profile.user._id,
            type: 'new_match',
            message: `New project "${title}" is a ${matchScore}% match for your skills!`,
            data: { projectId: project._id, matchScore },
          }).save();
        }
      }
    } catch (matchErr) {
      console.error('Match notification error:', matchErr.message);
    }

    res.json(project);
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  const { title, description, category, requiredSkills, budget, duration, experienceLevel, status } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user owns the project
    if (project.client.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (requiredSkills) {
      project.requiredSkills = typeof requiredSkills === 'string' 
        ? requiredSkills.split(',').map(skill => skill.trim())
        : requiredSkills;
    }
    if (budget) project.budget = budget;
    if (duration) project.duration = duration;
    if (experienceLevel) project.experienceLevel = experienceLevel;
    if (status) project.status = status;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Update project error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user owns the project
    if (project.client.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await project.deleteOne();
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error('Delete project error:', err.message);
    res.status(500).send('Server Error');
  }
};
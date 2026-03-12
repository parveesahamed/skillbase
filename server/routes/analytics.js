const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Project = require('../models/Project');
const User = require('../models/User');

// @route  GET /api/analytics/student
// @desc   Get analytics for the logged-in student
// @access Private
router.get('/student', auth, async (req, res) => {
  try {
    const studentId = req.user.id;

    // Verify the user is a student
    const user = await User.findById(studentId).select('userType');
    if (!user || user.userType !== 'student') {
      return res.status(403).json({ msg: 'Access denied. Students only.' });
    }

    // Total applications sent
    const totalApplications = await Application.countDocuments({ student: studentId });

    // Status breakdown using aggregation
    const statusBreakdown = await Application.aggregate([
      { $match: { student: require('mongoose').Types.ObjectId.createFromHexString(studentId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Normalize to a predictable shape with all three statuses
    const statusMap = { pending: 0, accepted: 0, rejected: 0 };
    statusBreakdown.forEach(({ _id, count }) => {
      if (_id in statusMap) statusMap[_id] = count;
    });

    // Average match score across all applications
    const avgResult = await Application.aggregate([
      { $match: { student: require('mongoose').Types.ObjectId.createFromHexString(studentId) } },
      {
        $group: {
          _id: null,
          avgMatchScore: { $avg: '$matchScore' },
        },
      },
    ]);
    const averageMatchScore = avgResult.length > 0
      ? Math.round(avgResult[0].avgMatchScore)
      : 0;

    // Applications over time (last 6 months, grouped by month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const applicationsOverTime = await Application.aggregate([
      {
        $match: {
          student: require('mongoose').Types.ObjectId.createFromHexString(studentId),
          appliedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timelineData = applicationsOverTime.map(({ _id, count }) => ({
      month: `${monthNames[_id.month - 1]} ${_id.year}`,
      applications: count,
    }));

    res.json({
      totalApplications,
      statusBreakdown: [
        { name: 'Pending', value: statusMap.pending, color: '#f59e0b' },
        { name: 'Accepted', value: statusMap.accepted, color: '#10b981' },
        { name: 'Rejected', value: statusMap.rejected, color: '#ef4444' },
      ],
      averageMatchScore,
      timelineData,
    });
  } catch (err) {
    console.error('Student analytics error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route  GET /api/analytics/client
// @desc   Get analytics for the logged-in client
// @access Private
router.get('/client', auth, async (req, res) => {
  try {
    const clientId = req.user.id;

    // Verify the user is a client
    const user = await User.findById(clientId).select('userType');
    if (!user || user.userType !== 'client') {
      return res.status(403).json({ msg: 'Access denied. Clients only.' });
    }

    // Total projects posted
    const totalProjects = await Project.countDocuments({ client: clientId });

    // Projects by status
    const projectStatusBreakdown = await Project.aggregate([
      { $match: { client: require('mongoose').Types.ObjectId.createFromHexString(clientId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const projectStatusMap = { open: 0, 'in-progress': 0, completed: 0, closed: 0 };
    projectStatusBreakdown.forEach(({ _id, count }) => {
      if (_id in projectStatusMap) projectStatusMap[_id] = count;
    });

    // All project IDs for this client
    const clientProjects = await Project.find({ client: clientId }).select('_id');
    const projectIds = clientProjects.map(p => p._id);

    // Total applications received across all projects
    const totalApplicationsReceived = await Application.countDocuments({
      project: { $in: projectIds },
    });

    // Applications per project (top 5 by count)
    const appsPerProject = await Application.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectInfo',
        },
      },
      { $unwind: '$projectInfo' },
      {
        $project: {
          _id: 0,
          projectTitle: '$projectInfo.title',
          applications: '$count',
        },
      },
    ]);

    // Application status breakdown across all client projects
    const appStatusBreakdown = await Application.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const appStatusMap = { pending: 0, accepted: 0, rejected: 0 };
    appStatusBreakdown.forEach(({ _id, count }) => {
      if (_id in appStatusMap) appStatusMap[_id] = count;
    });

    res.json({
      totalProjects,
      totalApplicationsReceived,
      projectStatusBreakdown: [
        { name: 'Open', value: projectStatusMap.open, color: '#10b981' },
        { name: 'In Progress', value: projectStatusMap['in-progress'], color: '#3b82f6' },
        { name: 'Completed', value: projectStatusMap.completed, color: '#8b5cf6' },
        { name: 'Closed', value: projectStatusMap.closed, color: '#6b7280' },
      ],
      applicationStatusBreakdown: [
        { name: 'Pending', value: appStatusMap.pending, color: '#f59e0b' },
        { name: 'Accepted', value: appStatusMap.accepted, color: '#10b981' },
        { name: 'Rejected', value: appStatusMap.rejected, color: '#ef4444' },
      ],
      appsPerProject,
    });
  } catch (err) {
    console.error('Client analytics error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

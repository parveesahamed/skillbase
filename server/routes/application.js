const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

router.post('/', auth, applicationController.createApplication);
router.get('/student', auth, applicationController.getStudentApplications);
router.get('/client-projects', auth, applicationController.getClientProjects);
router.get('/project/:projectId', auth, applicationController.getProjectApplications);
router.put('/:id/status', auth, applicationController.updateApplicationStatus);

module.exports = router;
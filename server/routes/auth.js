const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/social-login', authController.socialLogin);
router.get('/user', auth, authController.getCurrentUser);

module.exports = router;
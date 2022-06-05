const express = require('express');
const authController = require('./auth.controller');
const controller = require('./user.controller');
const router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup());
router.post('/login', authController.login());
router.get('/logout', authController.logout());

// Protect all routes after this middleware
router.use(authController.protect());

router.get('/confirm/:confirmationCode', authController.confirmUser());

module.exports = router;

const express = require('express');
const controller = require('./report.controller');
const authController = require('../users/auth.controller');
const router = express.Router();

router.use(authController.protect());

router.post('/:id', controller.getReportByCheck());
router.post('/tags/:tag', controller.getReportByTag());

module.exports = router;

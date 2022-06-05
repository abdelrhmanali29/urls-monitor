const express = require('express');
const controller = require('./checks.controller');
const authController = require('../users/auth.controller');
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect());

router.use('/').get(controller.list()).post(controller.create());
router
	.use('/:id')
	.get(controller.getById())
	.delete(controller.delete())
	.patch(controller.update());

module.exports = router;

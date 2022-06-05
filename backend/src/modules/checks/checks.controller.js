const catchAsync = require('../../utils/catchAsync');
const service = require('./checks.service');

module.exports = {
	list() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.listByUser(req.user);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	getById() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.getById(req.params.id);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	create() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.create(req.body, req.user);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	delete() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.delete(req.params.id);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	update() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.update(req.params.id, req.body);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},
};

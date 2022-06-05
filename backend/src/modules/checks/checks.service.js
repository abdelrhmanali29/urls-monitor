const AppError = require('../../utils/appError');
const { validation } = require('./checks.validation');
const sendEmail = require('../../utils/email');
const repository = require('./checks.repository');

module.exports = {
	async listByUser(user) {
		let err = false,
			response = {};

		let checks = await repository.find({
			filter: {
				user: user._id,
			},
			lean: true,
		});

		response = {
			statusCode: 200,
			status: 'success',
			data: checks,
		};

		return { err, response };
	},

	async getById(id) {
		let err = false,
			response = {};

		let check = await repository.findOne({
			filter: { id },
			lean: true,
		});

		response = {
			statusCode: 200,
			status: 'success',
			data: check,
		};

		return { err, response };
	},

	async create(check, user) {
		let err = false,
			response = {};

		const { valid, errors } = await validation(check);

		if (!valid) {
			err = new AppError('validation failed', 400, errors);
			return { err, response };
		}
		check.user = user.id;

		const newCheck = await repository.save(check);

		response = {
			statusCode: 201,
			status: 'success',
			data: newCheck,
		};

		return { err, response };
	},

	async delete(id) {
		let err = false,
			response = {};

		const deletedCheck = await repository.delete(id);

		if (!deletedCheck) return res.status(404).send('invalid check');

		stopMonitoring(req.params.id + req.user._id);

		response = {
			statusCode: 204,
			status: 'Deleted successfully',
		};

		return { err, response };
	},
};

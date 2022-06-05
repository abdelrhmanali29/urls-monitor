const catchAsync = require('../../utils/catchAsync');
const service = require('./report.service');

module.exports = {
	getReportByCheck() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.getReportByCheck(
				req.params.id,
				req.user
			);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	getReportByTag() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.getReportByTag(
				req.params.tag,
				req.user
			);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},
};

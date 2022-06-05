const CheckLog = require('./checkLog.model');

module.exports = {
	async find(query) {
		return await CheckLog.find(query.filter)
			.sort(query.sort)
			.limit(query.limit)
			.skip(query.skip)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async findOne(query) {
		return await CheckLog.findOne(query.filter)
			.sort(query.sort)
			.limit(query.limit)
			.skip(query.skip)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async findById(query) {
		return await CheckLog.findById(query.id)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async bulkWrite(updateOperations) {
		return await CheckLog.bulkWrite(updateOperations);
	},

	async count(filter) {
		return await CheckLog.countDocuments(filter);
	},

	async save(checkLog) {
		const transactionSaved = new CheckLog(checkLog);
		await transactionSaved.save();
		return transactionSaved;
	},

	async saveMany(checkLogs) {
		return await CheckLog.insertMany(checkLogs);
	},

	async findOneAndUpdate(filter, updatedCheckLog) {
		return await CheckLog.findOneAndUpdate(filter, updatedCheckLog, {
			new: true,
		});
	},

	async delete(id) {
		const checkLog = await CheckLog.findByIdAndDelete({ _id: id });

		if (!checkLog) return false;
	},
};

const Check = require('./checks.model');

module.exports = {
	async find(query) {
		return await Check.find(query.filter)
			.sort(query.sort)
			.limit(query.limit)
			.skip(query.skip)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async findOne(query) {
		return await Check.findOne(query.filter)
			.sort(query.sort)
			.limit(query.limit)
			.skip(query.skip)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async findById(query) {
		return await Check.findById(query.id)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async bulkWrite(updateOperations) {
		return await Check.bulkWrite(updateOperations);
	},

	async count(filter) {
		return await Check.countDocuments(filter);
	},

	async save(check) {
		const transactionSaved = new Check(check);
		await transactionSaved.save();
		return transactionSaved;
	},

	async saveMany(checks) {
		return await Check.insertMany(checks);
	},

	async findOneAndUpdate(filter, updatedCheck) {
		return await Check.findOneAndUpdate(filter, updatedCheck, {
			new: true,
		});
	},

	async delete(id) {
		const check = await Check.findByIdAndDelete({ _id: id });

		if (!check) return false;
	},
};

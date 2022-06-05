const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const checkSchema = new Schema({
	url: { type: String, required: [true, 'Please provide URL'] },
	name: { type: String, required: [true, 'Please provide check name'] },
	protocol: { type: String, required: [true, 'Please provide URL protocol'] },

	status: { type: Number },
	path: { type: String },
	port: { type: Number },
	tags: [{ type: String }],
	webhook: { type: String },
	threshold: { type: Number, default: 1 },
	timeout: { type: Number, default: 5000 },
	assert: { statusCode: { type: Number } },
	ignoreSSL: { type: Boolean, required: true },
	interval: { type: Number, default: 1000 * 60 * 10 },
	httpHeaders: [{ key: { type: String }, value: { type: String } }],
	authentication: { username: { type: String }, password: { type: String } },
	user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

schema.virtual('checkLogs', {
	ref: 'CheckLog',
	localField: '_id',
	foreignField: 'check',
});

schema.methods.toJSON = function () {
	const check = this.toObject();
	check['checkLogs'] = this.checkLogs;
	return check;
};

//plugins
checkSchema.plugin(uniqueValidator);
checkSchema.index({ name: 1, url: 1, protocol: 1 }, { unique: true });

const Check = mongoose.model('Check', checkSchema);
module.exports = Check;

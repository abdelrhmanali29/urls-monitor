const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const checkLogSchema = new Schema({
	status: { type: String },
	statusCode: { type: Number },
	responseTime: { type: String },
	date: { type: Date, default: new Date() },
	check: { type: Schema.Types.ObjectId, required: true, ref: 'Check' },
});

//plugins
checkLogSchema.plugin(uniqueValidator);
checkLogSchema.index({ date: 1, check: 1 }, { unique: true });

const CheckLog = mongoose.model('CheckLog', checkLogSchema);
module.exports = CheckLog;

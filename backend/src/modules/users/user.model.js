const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			required: [true, 'Please provide your email'],
			unique: true,
			lowerCase: true,
			validate: [validator.isEmail, 'Please provide a valid email'],
		},

		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minLength: 8,
			select: false,
		},

		status: {
			type: Boolean,
			enum: ['Pending', 'Active'],
			default: 'Pending',
		},

		passwordChangedAt: Date,
		confirmationCode: { type: String },
	},
	{
		versionKey: false,
	}
);

//plugins
userSchema.plugin(uniqueValidator);

// Model middleware (query middleware)
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 10);

	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// Instance methods
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

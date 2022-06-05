const repository = require('./user.repository');
const AppError = require('../../utils/appError');
const { validation, isBodyValid } = require('./user.validation');
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const utils = require('./user.utils');
const User = require('./user.model');
const sendEmail = require('../../utils/email');

module.exports = {
	async create(req) {
		let err = false;
		let response = {};
		let user = req.user;

		const { valid, errors } = await validation(user);

		if (!valid) {
			err = new AppError('validation failed', 400, errors);
			return { err, response };
		}
		user.confirmationCode = utils.signToken(newUser.email);
		const newUser = await repository.save(user);

		const confirmURL = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/users/confirm/${user.confirmationCode}`;

		const massage = `Hello ${user.email}, 
		please confirm your account. 
    click here:  ${confirmURL}`;

		try {
			await sendEmail({ massage, email: user.email });
			response = {
				status: 'success',
				statusCode: 200,
				message: 'Signup success, confirmation sent!',
			};

			return { err, response };
		} catch (err) {
			console.log(err);

			await repository.delete(newUser._id);

			err = new AppError(
				'There was an error signing up. Try again later!',
				500
			);

			return { err, response };
		}
	},

	async confirmUser(user, confirmationCode) {
		let err = false;
		let response = {};

		if (user.confirmationCode != confirmationCode) {
			err = new AppError('verification failed', 400);
			return { err, response };
		}

		response = {
			massage: 'Email verified successfully',
			status: 'success',
			statusCode: 200,
		};

		return { err, response };
	},

	async login(candidateUser) {
		let err = false;
		let response = {};

		const { email, password } = candidateUser;

		//1- Check if email and password exist
		if (!email || !password) {
			return next(new AppError('Please provide email and password!', 400));
		}

		// 2- Check if user exists && password is correct
		const user = await repository.findOne({
			filter: { email },
			select: 'password name email',
		});

		if (!user || !(await user.correctPassword(password, user.password))) {
			err = new AppError('Incorrect email or password', 401);
			return { err, response };
		}

		// 3- If everything is OK, send token to client
		const token = utils.signToken(user.id);
		if (!token) {
			err = new AppError('Error in login. Please log in again.', 500);
			return { err, response };
		}

		user.password = undefined;
		response = {
			token,
			data: user,
			status: 'success',
			statusCode: 200,
		};
		return { err, response };
	},

	async protect(headers) {
		let err = false;
		let response = {};

		let token;

		if (headers.authorization && headers.authorization.startsWith('Bearer')) {
			token = headers.authorization.split(' ')[1];
		}
		// 1- check if token is provided
		if (!token) {
			err = new AppError(
				'You are not logged in. Please log in to get access.',
				401
			);
			return { err, response };
		}

		// 2- Verfication token if not valid it will fire an error
		let decoded;
		try {
			decoded = await promisify(jwt.verify)(token, config.jwtSecret);
		} catch (err) {
			err = new AppError('Invalid token, Please log in again.', 401);
			return { err, response };
		}

		// 3- Check if user still exists
		const currentUser = await repository.findOne({
			filter: { _id: decoded.id },
			populate: {
				path: 'role',
				select: 'permissions',
				populate: {
					path: 'permissions',
				},
			},
		});

		if (!currentUser) {
			err = new AppError(
				'The user belonging to this token does no longer exist.',
				401
			);
			return { err, response };
		}

		// 4- Check if user changed password after the token was issued
		if (currentUser.isPasswordChangedAfter(decoded.iat)) {
			err = new AppError(
				'User recently changed password! Please log in again.',
				401
			);
			return { err, response };
		}

		// 5- If everything is OK, retrun current use
		response = {
			data: currentUser,
			status: 'success',
			statusCode: 200,
		};
		return { err, response };
	},
};

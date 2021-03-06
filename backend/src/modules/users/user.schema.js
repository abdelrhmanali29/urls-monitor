const schema = {
	type: 'object',
	required: ['email', 'password'],
	properties: {
		email: {
			type: 'string',
			format: 'email',
		},
		password: {
			type: 'string',
			minLength: 8,
			maxLength: 32,
		},
	},
};

module.exports = schema;

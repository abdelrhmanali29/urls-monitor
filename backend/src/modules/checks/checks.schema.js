const schema = {
	type: 'object',
	required: ['points', 'email'],
	properties: {
		url: { type: 'string', format: 'uri' },
		tags: { type: 'string' },
		name: { type: 'string' },
		path: { type: 'string' },
		port: { type: 'integer' },
		assert: { type: 'string' },
		webhook: { type: 'string' },
		timeout: { type: 'integer' },
		protocol: { type: 'string' },
		ignoreSSL: { type: 'string' },
		interval: { type: 'integer' },
		threshold: { type: 'integer' },
		httpHeaders: { type: 'string' },
		authentication: { type: 'string' },
	},
};

module.exports = schema;

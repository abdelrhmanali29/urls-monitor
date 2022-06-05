const schema = require('./checks.schema');
const Ajv = require('ajv').default;
const AjvFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
AjvFormats(ajv, ['date', 'time', 'date-time', 'email', 'url']);

const validation = async (check) => {
	let validate = ajv.compile(schema);

	let valid = validate(check);

	let errors = validate.errors;
	if (!errors) errors = [];

	errors.forEach((error) => {
		error.dataPath = error.dataPath.split('/')[1];
	});

	return { valid, errors };
};

module.exports = { validation };

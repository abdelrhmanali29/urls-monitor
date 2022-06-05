const axios = require('axios');
const https = require('https');

const getInstance = (check) => {
	const {
		url,
		path,
		port,
		protocol,
		authentication,
		httpHeaders,
		timeout,
		ignoreSSL,
	} = check;

	return axios.create({
		url: path,
		baseURL: `${protocol}://${url}${port}`,
		header: { ...httpHeaders, ...authentication },
		timeout,
		httpsAgent: new https.Agent({
			rejectUnauthorized: ignoreSSL,
		}),
	});
};

module.exports = {
	getInstance,
};

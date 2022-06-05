const redis = require('../../middlewares/redis');
const axios = require('../../utils/axios');
const checkRepo = require('../checks/checks.repository');
const repository = require('./checkLog.repository');

const getRunningCheck = async (check) => {
	return await redis.getResource(`${check._id}`);
};

const setRunningCheck = async (check) => {
	await redis.setResource(`${check._id}`, check);
};

const deleteCheck = async () => {};

const request = async (check) => {
	let response = {};
	let instance = axios.getInstance(check);

	let start = Date.now();
	let end;

	try {
		response = await instance.get();
	} catch (error) {
		for (let i = 1; i <= check.threshold - 1; i++) {
			start = Date.now();
			try {
				response = await instance.get();
				end = new Date();
				response['responseTime'] = end - start;
				return response;
			} catch (error) {
				continue;
			}
		}

		let status = 503;
		let statusText = 'Unavailable';

		if (error.response) {
			status = error.response.status;
			statusText = error.response.statusText;
		}

		return {
			status,
			statusText,
			responseTime: 0,
		};
	}

	end = Date.now();
	response['responseTime'] = end - start;

	return response;
};

const saveCheckLog = async (check, response) => {
	await checkRepo.findOneAndUpdate(
		{
			_id: check._id,
		},
		{ status: response.status }
	);

	await repository.save({
		status: response.status,
		statusText: response.statusText,
		responseTime: response.responseTime,
		check: check._id,
	});
};

const runCheck = async (check) => {
	let previousStats = check.status;

	check.checkInterval = setInterval(async () => {
		let checkResponse = await request(check);

		if (checkResponse.status != previousStats) {
			await Notification.pushOne(check, response, previousStats);
		}

		previousStats = response.status;
		await saveCheckLog(check, response);
	}, check.interval);

	await setRunningCheck(check);
};

const stopCheck = async (check) => {
	const checks = await getRunningChecks();

	clearInterval(checks[`${check._id}`].checkInterval);

	deleteCheck(check);

	return true;
};

module.exports = { runCheck, stopCheck };

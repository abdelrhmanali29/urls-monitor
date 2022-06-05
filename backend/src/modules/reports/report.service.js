const checkRepo = require('../checks/checks.repository');
const sendEmail = require('../../utils/email');
const calculateAverageAvailability = (interval, pollRecords) => {
	const numberOfRecords = pollRecords.length;
	let available = 0;
	let nonAvailable = 0;

	pollRecords.forEach((record) => {
		if (record.status < 500) available++;
		else nonAvailable++;
	});

	return [
		available * interval,
		nonAvailable * interval,
		nonAvailable,
		(available / numberOfRecords) * 100,
	];
};

const calculateAverageResponseTime = (pollRecords) => {
	const numberOfRecords = pollRecords.length;
	const totalResponseTime = pollRecords.reduce(
		(prev, curr) => prev + curr.responseTime,
		0
	);
	return totalResponseTime / numberOfRecords;
};

module.exports = {
	async getReportByCheck(checkId, user) {
		const check = checkRepo.findOne({
			filter: { _id: checkId },
			populate: 'checkLogs',
			lean: true,
		});

		const report = {
			uptime: 0,
			outages: 0,
			downtime: 0,
			url: check.url,
			availability: 0,
			responseTime: 0,
			date: new Date(),
			name: check.name,
			status: check.status,
			history: check.checkLogs,
		};

		const [
			upTime,
			downTime,
			outages,
			availability,
		] = calculateAverageAvailability(check.interval, check.checkLogs);
		report.uptime = upTime;
		report.downtime = downTime;
		report.outages = outages;
		report.availability = availability;

		report.responseTime = calculateAverageResponseTime(check.checkLogs);

		return report;
	},
};

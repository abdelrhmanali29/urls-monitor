const sendEmail = require('../../utils/email');
const userRepo = require('../users/user.repository');

const constructMessage = (check, response, lastStatus) => {
	const message = `your check status with id:${check.id} and name:${check.name} for the url:${check.url},
    has changed from ${lastStatus} to ${response.status}`;

	return message;
};

const pushOne = async (check, response, previousStats) => {
	const user = userRepo.findOne({
		filter: { _id: check.user },
		lean: true,
	});

	try {
		await sendEmail({
			massage: constructMessage(check, response, previousStats),
			email: user.email,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports = { pushOne };

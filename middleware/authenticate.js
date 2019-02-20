//Local
const User = require('./../models/User');
const {logError} = require('./../logs/error');


const authenticate = (req, res, next) => {
	const token = req.headers['x-auth'];
	User.findByToken(token)
		.then(user => {
			if(!user) {
				return Promise.reject();
			}
			req.user = user;
			req.token = token;
			next();
		}).catch(e => {
			res.status(401).send();
			logError(e, req);
		});
};

module.exports = {authenticate};
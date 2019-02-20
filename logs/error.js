const fs = require('fs');

const logError = (e, req) => {
	let now = new Date().toString();
	let log = `${now}: ${req.method} ${req.url}\n${e}\n\n`;
	fs.appendFile('./logs/error.log', log, err => {
		if(err) {
			console.log("Unable to append to error.log");
		}
	});
};

module.exports = {logError};
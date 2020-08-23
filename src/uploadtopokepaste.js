const axios = require('axios');
const querystring = require('querystring');
const config = require('./config.js');

exports.uploadToPokepaste = function (text) {
	return new Promise((resolve, reject) => {
		text = {
			title: `${config.teamNumber} ${config.mode} team(s)`,
			author: 'Geysers\' BuilderBot',
			notes: `Cutoff: ${config.cutoff}\nCore Mode: ${config.coreMode}\nRecurse Threshold: ${config.recurseThreshold}\nBreaker Threshold: ${config.breakerThreshold}\nhttps://github.com/Geyserexe/BuilderBot`,
			paste: text.replace(/\n(?:[^\r]|$)/g, match => match.replace(/\n/g, '\r\n'))
		}
		axios.post("https://pokepast.es/create", querystring.stringify(text)).then(res => {
			resolve(res.request.res.responseUrl);
		}).catch(reject);
	});
}
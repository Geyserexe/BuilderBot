const axios = require('axios');
const querystring = require('querystring');
const config = require('./config.js');

//courtesy of the wonderful PartMan

exports.uploadToPokepaste = function (text) {
	return new Promise((resolve, reject) => {
		text = {
			title: `${config.teamNumber} ${config.mode} team(s)`,
			author: 'Geysers\' BuilderBot',
			notes: `Cutoff: ${config.cutoff} recurseThreshold: ${config.recurseThreshold} breakerThreshold: ${config.breakerThreshold} Tier: ${config.tier} https://github.com/Geyserexe/BuilderBot`,
			paste: text.replace(/\n(?:[^\r]|$)/g, match => match.replace(/\n/g, '\r\n'))
		}
		axios.post("https://pokepast.es/create", querystring.stringify(text)).then(res => {
			resolve(res.request.res.responseUrl);
		}).catch(reject);
	});
}
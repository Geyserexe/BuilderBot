const axios = require('axios');
const querystring = require('querystring');
const config = require('../config.json');

exports.uploadToPokepaste = function (text, output) {
	return new Promise((resolve, reject) => {
		switch (typeof text) {
			case 'string': {
				text = {
                    title: `${config.teamNumber} ${config.mode} team(s)`,
					author: 'Geysers\' BuilderBot',
					notes: `Cutoff: ${config.cutoff}\nCore Mode: ${config.coreMode}\nRecurse Threshold: ${config.recurseThreshold}\nhttps://github.com/Geyserexe/BuilderBot`,
					paste: text.replace(/\n(?:[^\r]|$)/g, match => match.replace(/\n/g, '\r\n'))
				}
				break;
			}
			default: {
				if (text.paste) break;
				reject(new Error("Invalid Paste value."));
				return;
			}
		}
		axios.post("https://pokepast.es/create", querystring.stringify(text)).then(res => {
			if (typeof output === 'function') return output(res.request.res.responseUrl);
			switch (String(output).toLowerCase()) {
				case 'raw': {
					resolve(`https://pokepast.es/raw${res.request.path}`);
					break;
				}
				case 'html': {
					resolve(res.data);
					break;
				}
				default: resolve(res.request.res.responseUrl);
			}
		}).catch(reject);
	});
}
const prompt = require('prompt-sync')();
const WP_Download = require('./wp-download');
const WP_Config = require('./wp-config');
const path = require('path');

class WP_Init {
	constructor() {
		this.pid	= null;
		this.path = null;
	}
	async run() {
		this.pid = prompt('Give the name of the project:');
		this.path = path.join(process.cwd(), this.pid);
		//const downloadWp = new WP_Download();
		//downloadWp.downloadWordPress(this.pid, this.path);
		const configWp = new WP_Config();
		configWp.setConfig(this.pid, this.path);
	}
}

module.exports = WP_Init;
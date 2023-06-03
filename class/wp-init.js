const prompt = require('prompt-sync')();
const WP_Download = require('./wp-download');
const WP_Config = require('./wp-config');
const WP_Database = require('./wp-database');

const path = require('path');

class WP_Init {
	constructor() {
		this.pid	= null;
		this.path = null;
		this.getArgs()
	}
	getArgs() {
		const args = process.argv.filter(arg => 
			!arg.includes('node.exe') 
			&& !arg.includes('app.js')
			&& !arg.includes('wp-init.exe')
		);
		if(args[0]) {
			this.pid = args[0];
		}
	}
	async run() {
		if(!this.pid){
			this.pid = prompt('Give the name of the project:');
		}
		this.path = path.join(process.cwd(), this.pid);
		const downloadWp = new WP_Download();
		await downloadWp.downloadWordPress(this.pid, this.path);
		const configWp = new WP_Config();
		await configWp.setConfig(this.pid);
		const databaseWp = new WP_Database();
		await databaseWp.setNewDatabase(this.pid);
	}
}

module.exports = WP_Init;
const WP_Config = require('./wp-config');

const prompt = require('prompt-sync')();
const path = require('path');
const fs = require('fs');
const config = require('../app.config');
const hostile = require('hostile')
const {execSync} = require('child_process');

class WP_Init {
	constructor() {
		this.pid	= null;
		this.path = null;
		this.url = null;
		this.connection = null;
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
	async setNewDatabase(pid) {
		this.pid = pid;
		console.log('Connection to MySQL');
		this.connection = await mysql.createConnection({
			user: config.database_user,
			password: config.database_pass,
			host: config.database_host,
		});
		console.log('Create Database');
		const sqlQuery = `CREATE DATABASE IF NOT EXISTS ${this.pid} COLLATE utf8_general_ci;`;
		 const [rows, fields] = await this.connection.promise().query(sqlQuery);
		await this.connection.end();
		console.log('Database Created');
	}
	async run_wpcli(args) {
		console.log('Run WP CLI')
		const runWpCli = execSync(`"${config.php_executable}" "${config.wpcli_phar_file}" ${args}`).toString();
		console.log('WP CLI Output:', runWpCli);
	}
	async run() {
		if(!this.pid){
			this.pid = prompt('Give the name of the project:');
		}
		this.path = path.join(process.cwd(), this.pid);
		this.url = config.wordpress_url.replace('sitename', this.pid);
		
		if(fs.existsSync(this.path)) {
			console.log('Folder Exists');
			return;
		}
		const databaseWp = new WP_Database();
		await databaseWp.setNewDatabase(this.pid);
		fs.mkdirSync(this.path);
		console.log(`Path: ${this.path} created`);
		await this.run_wpcli(`core download --path="${this.path}"`);
		const configWp = new WP_Config();
		await configWp.setConfig(this.pid);
		console.log('Start Wordpress Setup');
		let command = `core install --url="${this.url}"`;
		command = `${command} --title="${this.pid}"`;
		command = `${command} --admin_user="${config.wordpress_user}"`;
		command = `${command} --admin_password="${config.wordpress_pass}"`;
		command = `${command} --admin_email="${config.wordpress_mail}"`;
		command = `${command} --path="${this.path}"`;
		await this.run_wpcli(command);
	}
}

module.exports = WP_Init;
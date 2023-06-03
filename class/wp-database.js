const config = require('../app.config');
const mysql = require('mysql2');

class WP_Database {
	constructor() {
		this.pid = null;
		this.connection = null;
	}
	async setNewDatabase(pid) {
		this.pid = pid;
		console.log('Connection to MySQL');
		this.connection = mysql.createConnection({
			user: config.database_user,
			password: config.database_pass,
			host: config.database_host,
		});
		console.log('Create Database');
		const sqlQuery = `CREATE DATABASE IF NOT EXISTS ${this.pid} COLLATE utf8_general_ci;`;
		await this.connection.execute(sqlQuery);
		await this.connection.end();
		console.log('Database Created');
	}
}
module.exports = WP_Database;
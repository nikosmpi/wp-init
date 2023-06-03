const fs = require('fs');
const path = require('path');
const download = require('download');
const zip = require('adm-zip');

class WP_Download {
	constructor() {
		this.pid	= null;
		this.path = null;
		this.path_temp = null;
		this.wp_link = 'https://wordpress.org/latest.zip';
		this.wp_download_path = null;
	}
	async downloadWordPress(pid, pathProj) {
		this.pid = pid;
		this.path = pathProj;
		this.path_temp = path.join(process.cwd(), `${this.pid}_temp`);
		this.path_temp_wp = path.join(process.cwd(), `${this.pid}_temp`, 'wordpress');
		this.wp_download_path = path.join(process.cwd(), `${this.pid}_temp`, 'latest.zip');
		if(fs.existsSync(this.path) && fs.existsSync(this.path_temp)) {
			console.log('Folder Exists');
			return;
		}
		console.log('Create Temp Folder');
		fs.mkdirSync(this.path_temp);
		console.log('Folder Created');

		console.log('Start Download Wordpress');
		fs.writeFileSync(this.wp_download_path, await download(this.wp_link));
		console.log('Latest WordPress Downloaded');

		console.log('Start to Upzip');
		const wordpressFile = new zip(this.wp_download_path);
		wordpressFile.extractAllTo(this.path_temp, true);
		console.log('Unzip Completed');
		fs.unlinkSync(this.wp_download_path);
		fs.renameSync(this.path_temp_wp, this.path);
		fs.rmSync(this.path_temp, { recursive: true, force: true });
		console.log('Files Completed');
	}
}

module.exports = WP_Download;
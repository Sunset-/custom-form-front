var gulp = require('gulp'),
	webpack = require('gulp-webpack'),
	sftp = require('gulp-sftp'),
	replace = require('gulp-replace'),
	zip = require('gulp-zip'),
	path = require('path'),
	moment = require('moment'),
	gulpSequence = require('gulp-sequence'),
	gulpSSH = require('gulp-ssh'),
	config = require('./publishConfig.json');

var publishFileName;


gulp.task('webpackbuild', function () {
	return gulp.src('src/main.js')
		.pipe(webpack(require('./config/webpack/webpack.build.config')))
		.pipe(gulp.dest('build/'));
});
// gulp.task('version0', ['build'], function () {
// 	gulp.src(['build/index.html'])
// 		.pipe(replace(/bundle\.js\?v=\d+/g, 'bundle.js?v=' + new Date().getTime()))
// 		.pipe(gulp.dest('build'));
// });

// gulp.task('version', ['version0'], function () {
// 	gulp.src(['build/opc.html'])
// 		.pipe(replace(/opc\.js\?v=\d+/g, 'opc.js?v=' + new Date().getTime()))
// 		.pipe(gulp.dest('build'));
// });
gulp.task('zip', function () {
	return gulp.src('build/**/*.*')
		.pipe(zip(publishFileName = ('build-' + moment().format("YYYYMMDD-HHmm") + '.zip')))
		.pipe(gulp.dest('publish'));
});
//上传到远程服务器任务
gulp.task('upload', function () {
	return gulp.src(path.resolve(__dirname, config.buildDir) + '/' + publishFileName)
		.pipe(sftp({
			host: config.sftp.host,
			port: config.sftp.port,
			user: config.sftp.user,
			key: config.sftp.key,
			pass: config.sftp.pass,
			remotePath: config.sftp.remotePath
		}));
});
//解压服务器文件
gulp.task('unzip', ['upload'], function () {
	var SSH = new gulpSSH({
		ignoreErrors: false,
		sshConfig: {
			host: config.sftp.host,
			port: config.sftp.port,
			username: config.sftp.user,
			password: config.sftp.pass
		}
	});
	SSH.shell(['cd ' + config.sftp.remotePath, 'unzip -o ' + publishFileName, 'rm -rf ' + publishFileName], {
			filePath: 'shell.log'
		})
		.pipe(gulp.dest('logs'));
});


gulp.task('build', function (cb) {
	gulpSequence('webpackbuild', 'zip', cb);
})

gulp.task('publish', function (cb) {
	gulpSequence('webpackbuild', 'zip', 'unzip', cb);
})
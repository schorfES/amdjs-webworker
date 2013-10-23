module.exports = function(grunt) {
	var
		pkg = grunt.file.readJSON('package.json')
	;

	// project configuration
	grunt.initConfig({
		pkg: pkg,

		jshint: {
			all: [
				'Gruntfile.js',
				'src/**/*.js'
			],
			options: {
				'boss': true,
				'curly': true,
				'eqeqeq': true,
				'eqnull': true,
				'expr': true,
				'globals': {
					'define': true,
					'require': true,
					'module': true,
					'window': true
				},
				'immed': true,
				'noarg': true,
				'onevar': true,
				'quotmark': 'single',
				'smarttabs': true,
				'trailing': true,
				'undef': true,
				'unused': true
			}
		},

		connect: {
			dev: {
				options: {
					port: 8000,
					base: 'src',
					keepalive: true
				}
			},
			prod: {
				options: {
					port: 8000,
					base: 'bin',
					keepalive: true
				}
			}
		},

		lintspaces: {
			all: {
				src: [
					'Gruntfile.js',
					'src/**/*'
				],
				options: {
					newline: true,
					trailingspaces: true,
					indentation: 'tabs'
				}
			}
		}
	});

	// load tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-lintspaces');

	// define tasks
	grunt.registerTask('validate', [
		'jshint',
		'lintspaces'
	]);

	grunt.registerTask('default', [
		'validate'
	]);
};

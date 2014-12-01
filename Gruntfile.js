module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			dev: {
				files: {
					'build/palace.js': ['lib/index.js']
				},
				options: {
					transform: [
						require("./tasks/definitions.js").transform,
						[ require("browserify-pegjs"), { cache: true } ]
					],
					browserifyOptions: { debug: true },
					watch: true
				}
			}
		},

		jshint: {
			all: ['Gruntfile.js', 'lib/**/*.js', 'tasks/**/*.js', 'test/**/*.js']
		},

		uglify: {
			my_target: {
				files: {
					'build/palace.min.js': 'build/palace.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask("publish", ["browserify", "uglify"]);
	grunt.registerTask("default", ["publish"]);
};

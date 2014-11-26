module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			dev: {
				files: {
					'build/sequence.js': ['src/index.js']
				},
				options: {
					transform: [
						[ require("browserify-pegjs"), { cache: true } ]
					],
					browserifyOptions: { debug: true },
					watch: true
				}
			}
		},

		uglify: {
			my_target: {
				files: {
					'build/sequence.min.js': 'build/sequence.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask("publish", ["browserify", "uglify"]);
	grunt.registerTask("default", ["publish"]);
};

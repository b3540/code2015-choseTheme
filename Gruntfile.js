module.exports = function (grunt) {
    grunt.initConfig({
        // configuration for bower
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            install: {
                options: {
                    verbose: true,
                    install: true,
                    targetDir: '.',
                    layout: function (type, component) {
                        if (type === 'css') {
                            return 'Content';
                        }
                        else {
                            return 'Scripts';
                        }
                    }
                }
            }
        },

        // configuration for tsd
        tsd: {
            install: {
                options: {
                    command: 'reinstall',
                    latest: false,
                    config: './tsd.json'
                }
            }
        }
    });

    grunt.registerTask('setup', ['bower', 'tsd']);

    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks('grunt-bower-task');
};
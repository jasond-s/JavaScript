module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        jsdoc: {
            dist: {
                src: ['src/Scripts/*.js', 'src/Tests/*.js', 'README.md'],
                jsdoc: 'node_modules/.bin/jsdoc',
                options: {
                    destination: 'docs'

                }
            }
        }
    });

    grunt.registerTask('default', ['jsdoc']);

    grunt.registerTask('test', ['karma']);
};
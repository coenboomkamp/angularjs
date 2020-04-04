module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dom_munger: {
            read: {
                options: {
                    read: [
                        {selector:'link[data-build!="exclude"]',attribute:'href',writeto:'appcss'},
                        {selector:'script',attribute:'src',writeto:'appjs'}
                    ]
                },
                src: 'index.html'
            },
            update: {
                options: {
                    remove: ['script[data-remove!="exclude"]', 'link[data-remove!="exclude"]'],
                    append: [
                        {selector:'head',html:'<link href="css/app.full.min.css" rel="stylesheet">'},
                        {selector:'body',html:'<script src="js/app.full.min.js"></script>'}
                    ]
                },
                src: 'index.html',
                dest: 'dist/index.html'
            }
        },
        concat: {
            js: {
                src: ['<%= dom_munger.data.appjs %>'],
                dest: 'dist/js/app.full.js',
                options: {
                    separator:';\n'
                },
            },
            css: {
                src: ['<%= dom_munger.data.appcss %>'],
                dest: 'dist/css/app.full.css'
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/js/app.full.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        cssmin: {
            css: {
                files: {
                    'dist/css/app.full.min.css': ['<%= concat.css.dest %>']
                }
            }
        },
        htmlmin: {
            index: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            },
            directives: {
                options: '<%= htmlmin.index.options %>',
                files: [{
                    expand: true,
                    src: 'js/**/*.html',
                    dest: 'dist/'
                }]
            },
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        src: ['img/**'],
                        dest: 'dist/'
                    },
                    {
                        src: ['js/directives/*.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-dom-munger');

    // Test
    grunt.registerTask('test', ['jshint', 'qunit']);

    // Default
    grunt.registerTask('default', ['jshint', 'qunit', 'dom_munger', 'concat', 'cssmin', 'uglify', 'copy', 'htmlmin']);
};
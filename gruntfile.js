module.exports = function (grunt) {

    // Load the plugins tasks 
    require('load-grunt-tasks')(grunt);

    // Tablica zawierająca zewnętrzne javascripty, które chcemy konkatenować do vendor.js
    // var vendorJs = [
    //     // 'bower_components/jquery/dist/jquery.min.js',
    //     // 'bower_components/bootstrap/js/dist/util.js',
    // ];
    // Project configuration.
    grunt.initConfig({
        watch: {
            scripts: {
                files: ['dev/js/*.js', 'test/*.js'],
                tasks: ['concat:dev', 'babel:dev']
            },
            sass: {
                files: ['dev/css/*.scss'],
                tasks: ['sass:dev']
            },
            options: {
                spawn: false,
                livereload: false,
                event: ['added', 'changed']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'build/css/*.css',
                        'build/js/*.js',
                        '*.html',
                        'test/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './'
                    }
                }
            }
        },
        clean: {
            build: ['build/**/*'],
            dev_temp: ['dev/temp/']
        },
        concat: {
            dev: {
                files: {
                    // 'build/js/vendor.js': [vendorJs],
                    'dev/temp/scripts.js': ['dev/js/*.js']
                }
            },
            dist: {
                files: {
                    // 'dev/temp/vendor.js': [vendorJs],
                    'dev/temp/scripts.js': ['dev/js/*.js']
                }
            }
        },
        browserify: {
            dist: {
                src: 'dev/temp/main.js',
                dest: 'dev/temp/bundled.js',
            }
        },
        babel: {
            options: {
                presets: ['env']
            },
            dist: {
                options: {
                    sourceMap: false,
                },
                files: {
                    'dev/temp/scriptsEs5.js': 'dev/temp/scripts.js'
                }
            },
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'build/js/scriptsEs5.js': 'dev/temp/scripts.js'
                }
            },
            modules: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dev/temp/computer-player.js': 'dev/js/computer-player.js',
                    'dev/temp/game.js': 'dev/js/game.js',
                    'dev/temp/main.js': 'dev/js/main.js'
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'build/js/scripts.min.js': 'dev/temp/scriptsEs5.js'
                }
            },
            modules: {
                files: { 
                    'build/js/scripts.min.js': 'dev/temp/bundled.js'
                }
            }
        },
        sass: {
            options: {
                sourceMap: false,
                includePaths: [
                    // 'bower_components/font-awesome/scss',
                    'node_modules/bootstrap/scss'
                ]
            },
            dev: {
                files:
                [{
                    expand: true,
                    cwd: 'dev/css/',
                    src: ['*.scss'],
                    dest: 'build/css/',
                    ext: '.css'
                }]
            },
            dist: {
                files:
                [{
                    expand: true,
                    cwd: 'dev/css/',
                    src: ['*.scss'],
                    dest: 'build/css/',
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
               src: 'build/css/main.css',
                dest: 'build/css/main.min.css'
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,                  // Enable dynamic expansion 
                    cwd: 'dev/img/',                   // Src matches are relative to this path 
                    src: ['*.{png,jpg,gif}'],   // Actual patterns to match 
                    dest: 'build/img/'
                }]
            }
        }
});

// Default task(s).
grunt.registerTask('default', ['clean', 'sass:dev', 'concat:dev', 'babel:dev', 'imagemin', 'browserSync', 'watch']);
grunt.registerTask('dist', ['clean', 'imagemin', 'sass:dist', 'postcss', 'concat:dev', 'babel:dist', 'uglify:dist']);
grunt.registerTask('modules', ['babel:modules', 'browserify', 'uglify:modules']);

};
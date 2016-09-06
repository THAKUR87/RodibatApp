/*! Gruntfile.js | (c) 2015 MarketLive, Inc. | All Rights Reserved */

module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    // Load grunt tasks automatically.
    require('load-grunt-tasks')(grunt);

    var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    'www/css/standalone.css': 'marketlive/less/global/standalone.less'
                }
            }
        },
        exec: {
            prepare: {
                command: 'cordova prepare',
                stdout: true,
                stderror: true
            }
        },
        watch: {
            views: {
                files: ['marketlive/views/**/*.*'],
                tasks: ['ngtemplates', 'concat:all', 'uglify:marketlive', 'exec:prepare']
            },
            scripts: {
                files: ['marketlive/scripts/**/*.js'], // which files to watch
                tasks: ['jshint', 'concat:all', 'uglify:marketlive', 'exec:prepare'],
                options: {
                    spawn: false
                }
            },
            styles: {
                files: ['marketlive/less/**/*.less'], // which files to watch
                tasks: ['less', 'exec:prepare'],
                options: {
                    spawn: false
                }
            }
        },
        bower_concat: {
            options: {separator: ';'},
            all: {
                dependencies: {
                    'angular': 'jquery'
                },
                exclude: [
                    'angular-mocks',
                    'font-awesome'
                ],
                dest: 'www/js/libs.js'
            }
        },
        concat: {
            options: {separator: ';'},
            all: {
                src: [
                    // Main App files
                    'marketlive/scripts/app/**/*.*',

                    // Filters
                    'marketlive/scripts/filters/**/*.*',

                    // Controllers
                    'marketlive/scripts/controllers/**/*.*',

                    // Services
                    'marketlive/scripts/services/**/*.*',

                    // Custom Directives
                    'marketlive/scripts/directives/**/*.*',

                    // Patches
                    'marketlive/scripts/patches/**/*.*',

                    // Template Cache
                    'marketlive/views/*.js',

                    // Misc
                    'marketlive/scripts/common/**/*.*'
                ],
                dest: 'www/js/marketlive.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            libs: {
                files: {
                    'www/js/libs.min.js': ['www/js/libs.js']
                }
            },
            marketlive: {
                options: {
                    compress: {
                        'drop_debugger': false
                    }
                },
                files: {
                    'www/js/marketlive.min.js': ['www/js/marketlive.js']
                }
            }
        },
        ngtemplates: {
            options: {
                module: 'pointOfSaleApplication'
            },
            app: {
                cwd: 'marketlive',
                src: 'views/**/*.html',
                dest: 'marketlive/views/templateCache.js'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'bower_components/font-awesome/fonts/',
                src: '**',
                dest: 'www/fonts/'
            }
        },
        jshint: {
            all: {
                src: ['marketlive/scripts/**/*.js']
            },
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            }
        },
        karma: {
            unit: {
                configFile: 'tests/karma.conf.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9005,
                    base: 'www',
                    keepalive: true,
                    middleware: function (connect, options) {
                        var middlewares = [];

                        // RewriteRules support
                        middlewares.push(rewriteRulesSnippet);

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        var directory = options.directory || options.base[options.base.length - 1];
                        options.base.forEach(function (base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });

                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            },
            rules: [
                {from: '^/ppos-assets/(.*)$', to: '/$1'},
            ]
        }
    });

    // on watch events configure jshint:all to only run on changed file
    grunt.event.on('watch', function (action, filepath) {
        grunt.config('jshint.all.src', filepath);
    });

    grunt.registerTask('test', ['karma:unit']);

    grunt.registerTask('serve', ['configureRewriteRules','connect']);

    grunt.registerTask('buildAll', ['jshint', 'less:development', 'ngtemplates', 'copy:main', 'bower_concat:all',
        'concat:all', 'uglify:libs', 'uglify:marketlive', 'exec:prepare']);

    grunt.registerTask('default', ['buildAll', 'watch']);
};

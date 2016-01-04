module.exports = function(grunt) {

    var files = {
        coreScripts: [
            'src/core/intro.js',
            'src/core/api.js',
            'src/core/utils.js',
            'src/core/uaBeacon.js',
            'src/core/utmBeacon.js',
            'src/core/outro.js'
        ],
        chrome: [
            'src/chrome/devtools.html',
            'src/chrome/js/devtools.js',
            'src/chrome/index.html',
            'src/chrome/img/**',
            'src/chrome/manifest.json'
        ],
        chromeScripts: [
            'src/chrome/js/intro.js',
            'build/core.js',
            'src/chrome/js/api.js',
            'src/chrome/js/ui.utils.js',
            'src/chrome/js/ui.window.js',
            'src/chrome/js/ui.itemlist.js',
            'src/chrome/js/ui.propertylist.js',
            'src/chrome/js/ui.splitview.js',
            'src/chrome/js/ui.group.js',
            'src/chrome/js/ui.toolbar.js',
            'src/chrome/js/outro.js'
        ],
        chromeStylesheets: [
            'src/chrome/css/ui.glyph.css',
            'src/chrome/css/ui.window.css',
            'src/chrome/css/ui.splitview.css',
            'src/chrome/css/ui.group.css',
            'src/chrome/css/ui.propertylist.css',
            'src/chrome/css/ui.itemlist.css',
            'src/chrome/css/ui.toolbar.css',
            'src/chrome/css/gadebugger.css'
        ],
        firefox: [
            'src/firefox/chrome/tool.xul',
            'src/firefox/chrome/tool.js',
            'src/firefox/chrome/panel.js',
            'src/firefox/chrome/resourceHelpers.jsm',
            'src/firefox/locale/**',
            'src/firefox/skin/**',
            'src/firefox/*'
        ],
        firefoxScripts: [
            'build/core.js'
        ]
    };

    function filterForLinting(files) {
        return files.filter(function (file) {
            return file.substr(0, 4) === "src/" &&
                file.substr(-9) !== "/intro.js" &&
                file.substr(-9) !== "/outro.js";
        });
    }

    function indentContent(content, path) {
        if (!path.match(/((ou|in)tro.js)|(.css)$/)) {
            content = content.replace(/(^|\n)(?!\n)/g, "\n    ");
        }
        return content;
    }

    function localisePath(path, cwd) {
        if (path.substring(0, cwd.length) === cwd) {
            path = path.substring(cwd.length);
        }
        return path;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                strict: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                camelcase: true,
                indent: 4,
                quotmark: 'single',
                undef: true,
                white: true,
                unused: true
            },
            core: filterForLinting(files.coreScripts),
            chrome: filterForLinting(files.chromeScripts.concat('src/chrome/js/devtools.js'))
        },

        nodeunit: {
            core: ['test/unit/core/*_test.js']
        },

        concat: {
            core: {
                src: files.coreScripts,
                dest: 'build/core.js',
                options: {
                    process: indentContent
                }
            },
            chromeCSS: {
                src: files.chromeStylesheets,
                dest: 'build/chrome/css/all.css',
                nonull: true
            },
            chromeJS: {
                src: files.chromeScripts,
                dest: 'build/chrome/js/all.js',
                options: {
                    process: indentContent
                },
                nonull: true
            },
            firefoxJS: {
                src: files.firefoxScripts,
                dest: 'build/firefox/chrome/core.js',
                nonull: true
            }
        },

        copy: {
            options: {
                processContentExclude: ['**/*.{png,gif,jpg,ico,psd}']
            },
            chrome: {
                options: {
                    process: function(content, path) {
                        return grunt.config.process(content);
                    }
                },
                expand: true,
                cwd: 'src/chrome/',
                dest: 'build/chrome/',
                src: files.chrome.map(function (file) {
                    return localisePath(file, 'src/chrome/'); // remove the CWD
                })
            },
            firefox: {
                options: {
                    process: function(content) {
                        return grunt.config.process(content);
                    }
                },
                expand: true,
                cwd: 'src/firefox/',
                dest: 'build/firefox/',
                src: files.firefox.map(function (file) {
                    return localisePath(file, 'src/firefox/'); // remove the CWD
                })
            }
        },

        compress: {
            firefox: {
                options: {
                    mode: 'zip',
                    archive: function() {
                        return 'dist/gadebugger-' + grunt.config('pkg.version') + ".xpi";
                    }
                },
                files: [{
                    src: ['**'],
                    cwd: 'build/firefox/',
                    dest: '',
                    expand: true
                }]
            }
        },

        watch: {
            gruntfile: {
                files: 'gruntfile.js',
                tasks: ['default'],
                options: {
                    reload: true
                }
            },
            core: {
                files: files.coreScripts,
                tasks: ['jshint:core', 'nodeunit:core', 'concat:core']
            },
            chrome: {
                files: files.chrome,
                tasks: ['copy:chrome'],
                options: {
                    spawn: false
                }
            },
            chromeJS: {
                files: files.chromeScripts.concat('src/chrome/js/devtools.js'),
                tasks: ['jshint:chrome', 'concat:chromeJS']
            },
            chromeCSS: {
                files: files.chromeStylesheets,
                tasks: ['concat:chromeCSS']
            },
            firefox: {
                files: files.firefox,
                tasks: ['copy:firefox'],
                options: {
                    spawn: false
                }
            },
            firefoxJS: {
                files: files.firefoxScripts,
                tasks: ['concat:firefoxJS']
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        if (target === "chrome") {
            grunt.config('copy.chrome.src', localisePath(filepath, 'src/chrome/')); // remove the CWD
        }
        if (target === "firefox") {
            grunt.config('copy.firefox.src', localisePath(filepath, 'src/firefox/')); // remove the CWD
        }
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('core', 'Builds the shared Google Analytics Core scripts.', ['jshint:core', 'nodeunit:core', 'concat:core']);
    grunt.registerTask('chrome', 'Builds the GA Debugger extension for Google Chrome.', ['jshint:chrome', 'concat:chromeJS', 'concat:chromeCSS', 'copy:chrome']);
    grunt.registerTask('firefox', 'Builds the GA Debugger extension for Firefox.', ['concat:firefoxJS', 'copy:firefox']);
    grunt.registerTask('build', 'Builds the GA Debugger extension for all browsers', ['core', 'chrome', 'firefox']);
    grunt.registerTask('dist', 'Builds a fresh set of distributable extension files', ['clean', 'build', 'package']);
    grunt.registerTask('default', 'Builds everything and watches for changes', ['build', 'watch']);

    grunt.registerTask('clean', 'Empties/creates the `build` and `dist` directories', function() {
        grunt.file.delete('build');
        grunt.file.delete('dist');
        grunt.file.mkdir('build');
        grunt.file.mkdir('dist');
    });

    grunt.registerTask('package', 'Package the builds into installable extensions', function() {
        var exec = require('child_process').exec,
            fs = require('fs'),
            done = grunt.task.current.async(),
            builds = 3;

        function packageDone(err) {
            builds--;
            if (!builds || err) {
                done(err);
            }
        }

        fs.exists('build/firefox', function (exists) {
            if (exists) {
                grunt.log.writeln('Building Firefox extension');
                grunt.task.run('compress:firefox');
                packageDone();
            }
        });

        fs.exists('build/chrome', function (exists) {
            if (exists) {
                grunt.log.writeln('Building Chrome extension');
                exec('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --pack-extension=build/chrome --pack-extension-key=chrome.pem', {}, function (err) {
                    if (err) {
                        grunt.log.error(err);
                        packageDone(err);
                    } else {
                        fs.rename('build/chrome.crx', 'dist/gadebugger-' + grunt.config('pkg.version') + '.crx', function (err) {
                            if (err) {
                                grunt.log.error(err);
                            } else {
                                grunt.log.ok('Built Chrome extension');
                            }
                            packageDone(err);
                        });
                    }
                });
            } else {
                packageDone();
            }
        });

        fs.exists('build/chrome', function (exists) {
            if (exists) {
                grunt.log.writeln('Building Opera extension');
                exec('/Applications/Opera.app/Contents/MacOS/Opera --pack-extension=build/chrome --pack-extension-key=opera.pem', {}, function (err) {
                    if (err) {
                        grunt.log.error(err);
                        packageDone(err);
                    } else {
                        fs.rename('build/chrome.nex', 'dist/gadebugger-' + grunt.config('pkg.version') + '.nex', function (err) {
                            if (err) {
                                grunt.log.error(err);
                            } else {
                                grunt.log.ok('Built Opera extension');
                            }
                            packageDone(err);
                        });
                    }
                });
            } else {
                packageDone();
            }
        });

    });
};

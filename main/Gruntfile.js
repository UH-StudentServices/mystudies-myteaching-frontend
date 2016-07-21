/*
 * This file is part of MystudiesMyteaching application.
 *
 * MystudiesMyteaching application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MystudiesMyteaching application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MystudiesMyteaching application.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var fs = require('fs'),
    httpProxy = require('http-proxy'),
    modRewrite = require('connect-modrewrite'),
    urlUtil = require('url'),
    _ = require('lodash'),
    proxy,
    proxyPaths,
    proxyMiddleware,
    gruntPlugins;

// Grunt plugins must be loaded manually since load-grunt-tasks doesn't know
// how to load node_modules from parent dir as of this writing
// (see https://github.com/sindresorhus/load-grunt-tasks/issues/47)
gruntPlugins = [
  'grunt-browser-sync',
  'grunt-build-control',
  'grunt-concurrent',
  'grunt-contrib-clean',
  'grunt-contrib-compass',
  'grunt-contrib-concat',
  'grunt-contrib-copy',
  'grunt-contrib-cssmin',
  'grunt-contrib-htmlmin',
  'grunt-contrib-imagemin',
  'grunt-contrib-uglify',
  'grunt-contrib-watch',
  'grunt-filerev',
  'grunt-html2js',
  'grunt-karma',
  'grunt-modernizr',
  'grunt-ng-annotate',
  'grunt-ng-constant',
  'grunt-postcss',
  'grunt-protractor-runner',
  'grunt-sass',
  'grunt-svgmin',
  'grunt-text-replace',
  'grunt-usemin',
  'grunt-wiredep',
  'gruntify-eslint'
];

proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8080/'
});

proxyPaths = [
  '/api',
  '/login',
  '/logout',
  '/redirect',
  '/files'];

proxyMiddleware = function(req, res, next) {
  var path = urlUtil.parse(req.url).pathname;

  if (_.any(proxyPaths, function(p) {return path.indexOf(p) === 0;})) {
    proxy.web(req, res);
  } else {
    next();
  }
};

module.exports = function(grunt) {
  gruntPlugins.forEach(function(plugin) {
    grunt.loadTasks('../node_modules/' + plugin + '/tasks');
  });

  require('time-grunt')(grunt);

  grunt.initConfig({
    application: {
      dist: 'dist'
    },
    watch: {
      dev: {
        files: [
          'src/scss/main.scss',
          'src/scss/opintoni/**/*.scss',
          'src/scss/styleguide/**/*.scss',
          'src/app/**/*.{js,html}',
          '../common/src/app/**/*.{js,html}',
          'src/**/*.json'
        ],
        tasks: ['cssDev', 'buildTemplates', 'eslint'],
        options: {
          spawn: false,
          interrupt: true
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'src/index.html',
            'src/app/**/*.js',
            '../common/src/app/**/*.js',
            'src/assets/styles/**/*.css',
            'src/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg,ico}'
          ]
        }
      },
      options: {
        startPath: '/',
        watchTask: true,
        host: 'local.student.helsinki.fi',
        open: 'external',
        port: 3000,
        server: {
          baseDir: 'src',
          routes: {
            '/bower_components': '../bower_components',
            '/common': '../common'
          },
          middleware: [proxyMiddleware,
            modRewrite([
              '^/proxy/hyyravintolat http://messi.hyyravintolat.fi/publicapi [P]',
              '^[^\\.]*$ /index.html [L]'
            ])
          ]
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= application.dist %>/*',
            '!<%= application.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    eslint: {
      src: ['src/app/**/*.js', 'test/spec/**/*.js', '*.js', '../common/**/*.js'],
      options: {
        quiet: true
      }
    },
    postcss: {
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({browsers: ['last 3 versions']})
          ]
        },
        src: 'src/assets/styles/main.css',
        dest: 'src/assets/styles/main.css'
      },
      prod: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({browsers: ['last 3 versions']})
          ]
        },
        src: 'src/assets/styles/main.css',
        dest: 'src/assets/styles/main.css'
      }
    },
    sass: {
      options: {
        sourceMap: false
      },
      main: {
        files: {
          'src/assets/styles/main.css': 'src/scss/main.scss'
        }
      }
    },
    compass: {
      styleguide: {
        options: {
          cssDir: 'src/assets/styles/styleguide',
          require: ['toolkit', 'sass-globbing', 'breakpoint', 'singularitygs'],
          sassDir: '../bower_components/Styleguide/sass'
        }
      }
    },
    concat: {
      // not used since Uglify task does concat,
      // but still available if needed
      //    dist: {}usemin
    },
    filerev: {
      dist: {
        src: [
          'dist/app/app.js',
          'dist/app/vendor.js',
          'dist/assets/styles/*.css']
      }
    },
    useminPrepare: {
      html: 'src/index.html',
      options: {
        dest: '<%= application.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              // Let cssmin concat files so it corrects relative paths to fonts and images
              css: ['cssmin']
            },
            post: {} // this empty obj is required for usemin to work
          }
        }
      }
    },
    usemin: {
      html: ['<%= application.dist %>/**/*.html'],
      css: ['<%= application.dist %>/assets/styles/**/*.css'],
      js: ['<%= application.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: ['<%= application.dist %>']
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          keepClosingSlash: true
        },
        files: [{
          expand: true,
          cwd: 'src/app',
          src: ['**/*.html'],
          dest: '.tmp/src/app'
        }, {
          expand: true,
          cwd: '../common/src/app',
          src: ['**/*.html'],
          dest: '.tmp/src/app'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      distMinified: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: '<%= application.dist %>',
          src: [
            'index.html',
            'assets/images/**/*.{png,jpg,gif,webp,ico}',
            'assets/icons/**/*',
            'assets/scripts/**/*',
            'assets/swf/*',
            'i18n/*'
          ]
        },
        {
          flatten: true,
          expand: true,
          cwd: '..',
          src: 'bower_components/Styleguide-icons/fonts/*',
          dest: '<%= application.dist %>/assets/fonts'
        },
        {
          flatten: true,
          expand: true,
          cwd: 'src',
          src: ['app/vendor/ng-file-upload/FileAPI.min.js',
                 'app/vendor/ng-file-upload/FileAPI.flash.swf'],
          dest: '<%= application.dist %>/app'
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: '<%= application.dist %>',
          src: [
            '*.html',
            'app/**',
            '../../common/src/app/**',
            'assets/**',
            'i18n/**'
          ]
        },
        {
          expand: true,
          cwd: '..',
          dest: '<%= application.dist %>',
          src: ['bower_components/**']
        },
        {
          expand: true,
          cwd: '..',
          dest: '<%= application.dist %>',
          src: ['common/src/app/**']
        }]
      }
    },
    html2js: {
      options: {
        singleModule: true,
        module: 'opintoniApp',
        existingModule: true,
        rename: function(moduleName) {
          return moduleName.replace('../.tmp/src/', '');
        }
      },
      templates: {
        src: ['.tmp/**/*.html'],
        dest: 'src/app/templates.js'
      }
    },
    concurrent: {
      serve: [
        'cssDev',
        'buildTemplates'
      ],
      test: [
        'cssProd',
        'buildTemplates'
      ],
      dist: [
        'cssProd',
        'compass:styleguide',
        'buildTemplates'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      local: {
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js',
        keepAlive: false,
        noColor: false,
        includeStackTrace: true
      },
      local: {
        options: {
          args: {
            browser: 'chrome',
            params: {
              student: {
                loginUrl: 'http://local.student.helsinki.fi:3000/locallog.html'
              },
              teacher: {
                loginUrl: 'http://local.teacher.helsinki.fi:3000/locallog.html'
              }
            }
          }
        }
      },
      dev: {
        options: {
          args: {
            browser: 'phantomjs',
            params: {
              student: {
                loginUrl: 'https://opi-1.student.helsinki.fi/locallog.html'
              },
              teacher: {
                loginUrl: 'https://opi-1.teacher.helsinki.fi/locallog.html'
              }
            }
          }
        }
      }
    },
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/app',
          src: '*.js',
          dest: '.tmp/concat/app'
        }]
      }
    }
  });

  grunt.registerTask('serve', [
    'eslint',
    'clean:server',
    'concurrent:serve',
    'browserSync',
    'watch:dev'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'karma:unit',
    'eslint'
  ]);

  grunt.registerTask('e2e', [
    'protractor:local'
  ]);

  grunt.registerTask('e2e_dev', [
    'protractor:dev'
  ]);

  grunt.registerTask('cssDev', [
    'sass',
    'postcss:dev'
  ]);

  grunt.registerTask('cssProd', [
    'sass',
    'postcss:prod'
  ]);

  grunt.registerTask('buildMinified', [
    'test',
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:distMinified',
    'ngAnnotate',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('build', [
    'test',
    'clean:dist',
    'copy:dist'
  ]);

  grunt.registerTask('buildTemplates', [
    'htmlmin',
    'html2js:templates',
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};

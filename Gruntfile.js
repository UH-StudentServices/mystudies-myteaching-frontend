
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
    useminAutoprefixer;

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

// usemin custom step
useminAutoprefixer = {
  name: 'autoprefixer',
  createConfig: require('grunt-usemin/lib/config/cssmin').createConfig // Reuse cssmins createConfig
};

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    application: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },
    watch: {
      options: {
        spawn: false
      },
      dev: {
        files: [
          'src/scss/main.scss',
          'src/scss/opintoni/**/*.{scss,sass}',
          'src/scss/styleguide/**/*.{scss,sass}',
          'src/scss/styleguide_additions/**/*.{scss,sass}',
          'src/app/**/*.html',
          'src/app/**/*.js'],
        tasks: ['sass:main', 'buildTemplates', 'eslint']
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'src/index.html',
            'src/**/*.json',
            'src/assets/styles/**/*.css',
            'src/app/**/*.js',
            'src/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg,ico}'
          ]
        }
      },
      options: {
        startPath: '/app/',
        watchTask: true,
        host: 'local.student.helsinki.fi',
        open: 'external',
        port: 3000,
        server: {
          baseDir: 'src',
          middleware: [proxyMiddleware,
            modRewrite([
              '^/app/$ http://localhost:3000/ [P]',
              '^/app/locallog.html http://localhost:3000/locallog.html [P]',
              '^/app/app/ http://localhost:3000/app/ [P]',
              '^/app/bower_components/ http://localhost:3000/bower_components/ [P]',
              '^/app/assets/ http://localhost:3000/assets/ [P]',
              '^/app/i18n/ http://localhost:3000/i18n/ [P]',
              '^/proxy/hyyravintolat http://messi.hyyravintolat.fi/publicapi [P]'])
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
      src: ['src/app/**/*.js', 'test/spec/**/*.js', '*.js'],
      options: {
        quiet: true
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
          sassDir: 'src/bower_components/Styleguide/sass'
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
              css: ['cssmin', useminAutoprefixer]
            },
            post: {}
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
          dest: '.tmp/src/app'}
        ]
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
            'assets/swf/*',
            'i18n/*'
          ]
        },
        {
          flatten: true,
          expand: true,
          cwd: 'src',
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
            'assets/**',
            'i18n/**',
            'bower_components/**'
          ]
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
        'sass:main',
        'buildTemplates'
      ],
      test: [
        'sass:main',
        'buildTemplates',
        'eslint'
      ],
      dist: [
        'sass:main',
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
                loginUrl: 'http://local.student.helsinki.fi:3000/app/locallog.html'
              },
              teacher: {
                loginUrl: 'http://local.teacher.helsinki.fi:3000/app/locallog.html'
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
                loginUrl: 'https://opi-1.student.helsinki.fi/app/locallog.html'
              },
              teacher: {
                loginUrl: 'https://opi-1.teacher.helsinki.fi/app/locallog.html'
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
    },
    exec: {
      bowerInstall: 'bower install'
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');

  grunt.registerTask('serve', [
    'clean:server',
    'concurrent:serve',
    'browserSync',
    'watch:dev'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'karma:unit'
  ]);

  grunt.registerTask('e2e', [
    'protractor:local'
  ]);

  grunt.registerTask('e2e_dev', [
    'protractor:dev'
  ]);

  grunt.registerTask('buildMinified', [
    'exec:bowerInstall',
    'test',
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy:distMinified',
    'ngAnnotate',
    'cssmin',
    'autoprefixer',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('build', [
    'exec:bowerInstall',
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

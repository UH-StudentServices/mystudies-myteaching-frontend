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

var httpProxy = require('http-proxy');
var modRewrite = require('connect-modrewrite');

// Grunt plugins must be loaded manually since load-grunt-tasks doesn't know
// how to load node_modules from parent dir as of this writing
// (see https://github.com/sindresorhus/load-grunt-tasks/issues/47)
var gruntPlugins = [
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
  'grunt-sass',
  'grunt-svgmin',
  'grunt-text-replace',
  'grunt-usemin',
  'grunt-wiredep',
  'gruntify-eslint'
];

var proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8080'
});

var proxyMiddleware = function(req, res, next) {
  if (req.url.indexOf('api') !== -1) {
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
          '../main/src/scss/opintoni/**/*.scss',
          'src/scss/portfolio/**/*.scss',
          '../common/src/scss/**/*.scss',
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
        watchTask: true,
        host: 'local.student.helsinki.fi',
        open: false,
        ghostMode: false,
        port: 3002,
        server: {
          baseDir: 'src',
          routes: {
            '/bower_components': '../bower_components',
            '/common': '../common',
            '/assets/fonts': '../bower_components/Styleguide/fonts'
          },
          middleware: [proxyMiddleware,
                       modRewrite([
                        '^[^\\.]*$ /index.html [L]',
                        '^/portfolio* http://localhost:3002 [P]'
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
    concat: {
      // not used since Uglify task does concat,
      // but still available if needed
      //    dist: {}
    },
    filerev: {
      dist: {
        src: [
          'dist/app/app.js',
          'dist/app/vendor.js',
          'dist/app/newrelic.js',
          'dist/assets/styles/*.css',
          'dist/assets/fonts/hy-icons.*',
          'dist/assets/images/**/*.{png,ico,jpg}',
          'dist/assets/icons/**/*.{png,svg}',
          '!dist/assets/icons/avatar.png'
        ]
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
              css: ['cssmin']
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
        assetsDirs: [
          '<%= application.dist %>',
          '<%= application.dist %>/assets/fonts'
        ]
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
            'i18n/*'
          ]
        },
        {
          flatten: true,
          expand: true,
          cwd: '..',
          src: 'bower_components/Styleguide/fonts/*',
          dest: '<%= application.dist %>/assets/fonts'
        },
        {
          expand: true,
          dot: true,
          cwd: '../bower_components/ckeditor',
          dest: '<%= application.dist %>',
          src: [
            'config.js',
            'editor.css',
            'lang/*',
            'skins'
          ]
        }
        ]
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
          flatten: true,
          expand: true,
          cwd: '..',
          dest: '<%= application.dist %>/assets/fonts',
          src: ['common/src/assets/fonts/*']
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
        module: 'templates',
        existingModule: false,
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
        'buildTemplates'
      ]
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
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    replace: {
      ckeditor: {
        src: ['<%= application.dist %>/index.html'],
        dest: '<%= application.dist %>/index.html',
        replacements: [
          {
            from: '// CKEDITOR_BASEPATH = "/";',
            to: 'CKEDITOR_BASEPATH = "/portfolio";'
          }
        ]
      }
    }
  });

  grunt.registerTask('serve', [
    'clean:server',
    'concurrent:serve',
    'browserSync',
    'watch:dev'
  ]);

  grunt.registerTask('cssDev', [
    'sass',
    'postcss:dev'
  ]);

  grunt.registerTask('cssProd', [
    'sass',
    'postcss:prod'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'htmlmin',
    'html2js',
    'karma:unit'
  ]);

  grunt.registerTask('buildMinified', [
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
    'htmlmin',
    'replace'
  ]);

  grunt.registerTask('build', [
    'test',
    'buildTemplates',
    'clean:dist',
    'copy:dist'
  ]);

  grunt.registerTask('buildTemplates', [
    'htmlmin',
    'html2js:templates'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};

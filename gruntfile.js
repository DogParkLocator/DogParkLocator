'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    clean: ['build/'],

    jshint: {
      source: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: ['src/**/*.js']
        }
      }
    },
    copy: {
      html: {
        files: [
          {
            expand: true,
            cwd: 'src/frontend/',
            src: 'index.html',
            dest: 'build/'
          },
          {
            expand: true,
            cwd: 'src/frontend/',
            src: ['views/**/*.template.html'],
            dest: 'build/'
          }
        ]


      },
      allImages: {
        files: [
          {
            cwd: 'src/frontend/img',
            src: ['*.jpg', '*.png'],
            dest: 'build/img/',
            expand: true
          }
        ]
      },
      angular: {
        files: [
          {
            cwd: 'node_modules/angular',
            src: ['angular.js'],
            dest: 'build/js/',
            expand: true
          },
          {
            cwd: 'node_modules/angular-ui-router/release',
            src: ['angular-ui-router.js'],
            dest: 'build/js/',
            expand: true
          }
        ]
      }
    },
    sass: {
      allSASS: {
        files: {
          'build/style.css': 'src/frontend/sass/main.scss'
        }
      }
    },
    concat: {
      dist: {
        src: ['src/frontend/js/park.module.js', 'src/frontend/js/**/*.js'],
        dest: 'build/js/app.js'
      }
    },
    babel: {
      all: {
        options: {
          sourceMap: true,
          presets: ['es2015']
        },
        files: {
          'build/js/app.js' : 'build/js/app.js'
        }
      }
    },
    karma: {
      all: {
        options : {
          frameworks: ['mocha', 'chai'],
          browsers: ['Chrome'],
          singleRun: true,
          preprocessors: {
            'src/frontend/js/**/*.js': ['coverage']
          },
          reporters: ['dots', 'coverage'],
          coverageReporter: {
            type: 'text-summary'
          },
          files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'src/frontend/js/park.module.js',
            'src/frontend/js/**/*.js',
            'tests/**/*.spec.js'
          ]

        }
      }
    },
    watch: {
      css: {
        files:['src/frontend/sass/*.scss'],
        tasks: ['sass']
      },
      html: {
        files: ['src/frontend/index.html', 'src/frontend/views/**/*.html'],
        tasks: ['copy']
      },
      js: {
        files: ['src/frontend/js/*.js'],
        tasks: ['concat', 'babel']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint','karma','clean', 'concat', 'babel', 'copy', 'sass']);
};

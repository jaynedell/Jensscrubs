module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: [
          "js-dev/vendor/picturefill.min.js",
          "js-dev/modules/*.js",
          "js-dev/script.js"
        ],
        dest: "swell-rewards.js"
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: [{ src: "swell-rewards.js", dest: "swell-rewards.min.js" }]
      }
    },
    sass: {
      dist: {
        options: {
          sourcemap: "none"
        },
        files: {
          "swell-rewards.css": "css-dev/style.scss"
        }
      }
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            src: "swell-rewards.css",
            dest: "./",
            ext: ".min.css"
          }
        ]
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ["swell-rewards.min.js"],
            dest: "../jens-scrubs/assets/js"
          },
          {
            expand: true,
            src: ["swell-rewards.min.css"],
            dest: "../jens-scrubs/assets/scss"
          },
          {
            expand: true,
            filter: "isFile",
            flatten: true,
            src: ["images/*"],
            dest: "../jens-scrubs/assets/img"
          }
        ]
      }
    },
    watch: {
      scripts: {
        files: "js-dev/**/*.js",
        tasks: ["concat", "uglify"]
      },
      css: {
        files: "css-dev/**/*.scss",
        tasks: ["sass", "cssmin"]
      },
      src: {
        files: ["swell-rewards.min.js", "swell-rewards.min.css", "images/*"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");

  grunt.registerTask("scripts", ["concat", "uglify"]);
  grunt.registerTask("styles", ["sass", "cssmin"]);
  grunt.registerTask("files", ["copy"]);
  grunt.registerTask("default", ["scripts", "styles", "files", "watch"]);
};

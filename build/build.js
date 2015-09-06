var gulp = require('gulp');
var markdown = require('gulp-markdown');
var exec = require('child_process').execSync;

exports.build = function() {
  return gulp.src('src/**/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('dist'));
};

exports.commit = function() {
  exec('git add dist');
  exec('git commit -m "Build '+new Date()+'"');
};

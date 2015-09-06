var gulp = require('gulp');
var markdown = require('gulp-markdown');

module.exports = function() {
  return gulp.src('src/**/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('dist'))
};

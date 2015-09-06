var gulp = require('gulp');

gulp.task('build', require('./build/build'));
gulp.task('deploy', require('./build/deploy'));

gulp.task('default', ['build', 'deploy']);

var gulp = require('gulp');

var build = require('./build/build');
gulp.task('build:build', build.build);
gulp.task('build:commit', ['build:build'], build.commit);
gulp.task('build', ['build:commit']);

gulp.task('deploy', ['build'], require('./build/deploy'));

gulp.task('default', ['deploy']);

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer');

// task to compile sass files on save and output a minified CSS file
let styles = () => {
    return gulp.src('public/sass/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(prefix('last 2 versions'))
        .pipe(gulp.dest('public/css/'));
};

// gulp watch task to watch for file changes
let watch = () => {
  gulp.watch('public/sass/*.sass', gulp.series(styles));
};

let runTask = process.argv.includes("--dev") ? gulp.series(styles, gulp.parallel(watch)) : styles
// default gulp task - styles task runs first to generate CSS. Then, the watch task is run
gulp.task('default', runTask, (done) => {
    done();
});

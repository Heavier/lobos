var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require("gulp-notify");

//style paths
var sassFiles = './assets/scss/**/*.scss',
    jsDest = './assets/js-compilado/',
    jsAUnir = './assets/js/**/*.js';

// Compilación archivos SCSS
gulp.task('styles', function(){
    gulp.src(sassFiles)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(notify("compilando SCSS"))
        .pipe(gulp.dest('./')); // output to theme root
});

//Minifica JS
gulp.task('minificar-js', function() {
   return gulp.src(['./assets/js/lib/jquery.min.js','./assets/js/lib/bootstrap.min.js','./assets/js/*.js'])
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(notify("unificando JS"))
      .pipe(gulp.dest(jsDest));
});

// Escuchador de todas las tareas
gulp.task('watch',function() {
    gulp.watch(sassFiles,['styles']);
    gulp.watch(jsAUnir,['minificar-js']);
});

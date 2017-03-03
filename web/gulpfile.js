const gulp = require('gulp');

gulp.task('build', ['lint', 'html2js', 'html', 'images', 'fonts', 'i18n', 'extras'], () => {
    gulp.start('concatTemplates', ()=> {
    return gulp.src('dist/**/*')
        .pipe($.size({title: 'build', gzip: true}));
});


})

gulp.task('default', function(){
    gulp.start('build');
})
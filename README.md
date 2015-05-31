Gulp Decorator Gulp plugin
===================
Simple JavaScript Decorator Gulp Plugin.
###Installation &nbsp;  [![npm version](https://badge.fury.io/js/gulp-jsdecorator.svg)](http://badge.fury.io/js/gulp-jsdecorator)
```sh
npm install gulp-jsdecorator
```
###Simple Usage
```javascript
var decorator = require("gulp-jsdecorator");

/**
 * Build JS
 */
gulp.task('js', function () {
  gulp.src(['./src/**/*.js'])
    .pipe(decorator({}))
    .pipe(gulp.dest('./dist/'));
});
```




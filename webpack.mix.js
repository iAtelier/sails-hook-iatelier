const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
// mix.options({ processCssUrls: false })  
mix.js('src/js/iatelier-analog.js', 'public/assets/iatelier/js')
	.js('src/js/selectize.js', 'public/assets/iatelier/js')
	.sass('src/sass/selectize.scss', 'public/assets/iatelier/css')
	.sass('src/sass/iatelier.scss', 'public/assets/iatelier/css');
	
// mix.copy('node_modules/css-oldschool/src/fonts', 'public/fonts');
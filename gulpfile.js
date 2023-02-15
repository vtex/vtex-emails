const gulp = require( 'gulp' ),
		sass = require( 'gulp-sass' )(require('sass')),
		data = require( 'gulp-data' ),
		gcmq = require( 'gulp-group-css-media-queries' ),
		gutil = require( 'gulp-util' ),
		juice = require( '@akzhan/gulp-juice' ),
		j = require( 'juice' ),
		del = require( 'del' ),
		stripComments = require( 'gulp-strip-comments' ),
		connect = require( 'gulp-connect' ),
		path = require( 'path' ),
		hb = require( 'gulp-hb' ),
		injectPartials = require( 'gulp-inject-partials' ),
		remove = require( 'gulp-email-remove-unused-css' ),
		replace = require( 'gulp-replace' ),
		extReplace = require( 'gulp-ext-replace' ),
		i18n = require( 'gulp-i18n-localize' ),
		filesToSass = [
			'source/sass/inlined.scss',
			'source/sass/embedded.scss',
			'source/sass/tachyons.scss',
		],
		filesToWatch = [
			'source/sass/**/*.scss',
			'source/templates/**/*',
		],
		orderJsonToRead = 'vtex';

j.codeBlocks.HBS = {};

// Partials
gulp.task( 'partials', function( done ) {
	'use strict';
	return gulp.src( './source/templates/*.hbs' )
		.pipe( injectPartials() )
		.pipe( gulp.dest( './temp' ) )
		.on( 'end', done );
} );

// i18n
gulp.task( 'i18n', function( done ) {
	'use strict';
	gulp.src( [ 'temp/*.hbs' ] )
		.pipe( i18n( {
			locales: [ 'pt-BR', 'en-US' ],
			localeDir: 'source/locales',
			delimeters: [ '((', '))' ]
		} ) )
		.pipe( gulp.dest( 'temp' ) )
		.on( 'end', done );
} );

// Compile HBS
gulp.task( 'hbs', function( done ) {
	'use strict';
	var hbStream = hb( { bustCache: true } )
		// Helpers
		.helpers( require( 'handlebars-helpers' ) )
		.helpers( './source/helpers/helpers.js' );

	return gulp
		.src( 'temp/*/*.hbs' )
		.pipe( data( function( file ) {
			return require(
				file.path.replace('temp','source').replace('en-US','data\\vtex').replace('pt-BR','data\\vtex').replace('.hbs','.json')
			);
		} ) )
		.pipe( hbStream )
		.pipe( gulp.dest( 'temp' ) )
		.on( 'end', done );
} );

// Build SASS
gulp.task( 'build:sass', function( done ) {
	'use strict';

	return gulp.src( filesToSass )
		.pipe(
			sass( {
				outputStyle: 'compressed',
			} )
				.on( 'error', gutil.log )
		)
		.pipe( gcmq() )
		.pipe( gulp.dest( 'temp/css/' ) )
		.on( 'end', done );
} );

// Inline CSS
gulp.task( 'inline:css', function( done ) {
	'use strict';

	return gulp.src( 'temp/*/*.hbs' )
		.pipe(
			juice( {
				applyHeightAttributes: false,
				applyWidthAttributes: false,
				// xmlMode: true,
				// preserveMediaQueries: false,
				webResources: {
					relativeTo: path.resolve( __dirname, 'temp/' ),
					images: false,
					svgs: false,
					scripts: false,
					links: false,
				},
			} )
				.on( 'error', gutil.log )
		)
		.pipe( gulp.dest( 'temp' ) )
		.on( 'end', done );
} );

// Clean CSS
gulp.task( 'clean:css', function( done ) {
	'use strict';

	return del( [
		'temp/css/',
	] )
		.then( function() {
			done();
		} );
} );

// Clean HTML
gulp.task( 'clean:html', function( done ) {
	'use strict';

	return gulp.src( 'temp/*/*.hbs' )
		.pipe(
			stripComments( {
				safe: true,
				trim: true,
			} )
				.on( 'error', gutil.log )
		)
		.pipe( gulp.dest( 'temp' ) )
		.pipe( connect.reload() )
		.on( 'end', done );
} );

// Remove unused CSS
gulp.task( 'remove-css', function( done ) {
	'use strict';
	return gulp.src( 'temp/*/*.hbs' )
		.pipe( remove() )
		.pipe( gulp.dest( 'temp' ) )
		.on( 'end', done );
} );

// Add important to internal css rules
gulp.task( 'add-css-important', function( done ) {
	'use strict';
	gulp.src( [ 'temp/*/*.hbs' ] )
		.pipe( replace( /(?!(.+)body.+)(.+\:)(\s+)?(\S+)(?!\!)(\s+)?(;)/g, '$2 $4 !important$6' ) )
		.pipe( gulp.dest( 'temp' ) )
		.pipe( connect.reload() )
		.on( 'end', done );
} );

// Copy temp to public folder
gulp.task( 'copy-public', function( done ) {
	'use strict';
	gulp.src( [ 'temp/*/*.hbs' ] )
		.pipe( extReplace( '.html' ) )
		.pipe( gulp.dest( 'public' ) )
		.on( 'end', done );
} );

// Copy temp to dist folder
gulp.task( 'copy-dist', function( done ) {
	'use strict';
	gulp.src( [ 'temp/*/*.hbs' ] )
		.pipe( extReplace( '.html' ) )
		.pipe( gulp.dest( 'dist' ) )
		.on( 'end', done );
} );

// Clean temp folder
gulp.task( 'clean:temp', function( done ) {
	'use strict';
	return del( [
		'temp',
	] )
		.then( function() {
			done();
		} );
} );

// Clean project folder
gulp.task( 'clean', function( done ) {
	'use strict';

	return del( [
		'public/*',
	] )
		.then( function() {
			done();
		} );
} );

// Default
gulp.task(
	'default',
	gulp.series( [
		'partials',
		'i18n',
		'hbs',
		'build:sass',
		'inline:css',
		'clean:css',
		'add-css-important',
		'copy-public',
		'clean:temp',
	] )
);

// Default
gulp.task(
	'preview',
	gulp.series( [
		'partials',
		'i18n',
		'hbs',
		'build:sass',
		'inline:css',
		'clean:css',
		'add-css-important',
		'remove-css',
		'copy-public',
		'clean:temp',
	] )
);

// Build
gulp.task(
	'dist',
	gulp.series( [
		'partials',
		'i18n',
		'build:sass',
		'inline:css',
		'clean:css',
		'clean:html',
		'add-css-important',
		'remove-css',
		'copy-dist',
		'clean:temp',
	] )
);

// Start server w/ live reload
gulp.task( 'start', function( done ) {
	'use strict';

	connect.server( {
		port: 8000,
		root: 'public',
		livereload: true,
	} );

	done();
} );

// Watch
gulp.task( 'watch', function( done ) {
	'use strict';

	gulp.watch(
		filesToWatch,
		gulp.series( [
			'default',
		] )
	);

	done();
} );

// Development mode
gulp.task(
	'dev',
	gulp.series( [
		'default',
		gulp.parallel( [
			'start',
			'watch',
		] )
	] )
);

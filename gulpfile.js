const gulp = require("gulp");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const browsersync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");
const del = require("del");
const plumber = require("gulp-plumber");

/* Options
 * ------ */
const options = {
	pug: {
		src: "app/pug/**/*.pug",
		dest: "public"
	},
	scripts: {
		src: "app/js/**/*",
		dest: "public/js"
	},
	styles: {
		src: "app/sass/**/*.+(sass|scss)",
		dest: "public/css"
	},
	css: {
		src: "app/css/**/*.css",
		dest: "public/css"
	},
	images: {
		src: "app/images/**/*.+(png|jpeg|jpg|gif|svg)",
		dest: "public/images"
	},
	files: {
		src: "app/files/**/*.+(png|jpeg|jpg|gif|svg)",
		dest: "public/files"
	},
	fonts: {
		src: "app/fonts/*",
		dest: "public/fonts"
	},
	browserSync: {
		baseDir: "public"
	}
};

/* Browser-sync
 * ------------ */
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: options.browserSync.baseDir
		},
		port: 3000
	});
	done();
}

/* Styles
 * ------ */

function styles() {
	return gulp
		.src(options.styles.src)
		.pipe(
			plumber(function (err) {
				console.log("Styles Task Error");
				console.log(err);
				this.emit("end");
			})
		)
		.pipe(sass().on("error", sass.logError))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 2 versions'],
				cascade: false,
				grid: true
			})
		)
		.pipe(gulp.dest(options.styles.dest))
		.pipe(
			browsersync.reload({
				stream: true
			})
		);
}

function css() {
	return gulp.src(options.css.src).pipe(gulp.dest(options.css.dest));
}

/* Scripts
 * ------ */

function scripts() {
	return gulp
		.src(options.scripts.src)
		// .pipe(
		// 	plumber(function (err) {
		// 		console.log("Scripts Task Error");
		// 		console.log(err);
		// 		this.emit("end");
		// 	})
		// )
		// .pipe(babel())
		// .pipe(uglify())
		.pipe(gulp.dest(options.scripts.dest))
		.pipe(
			browsersync.reload({
				stream: true
			})
		);
}

/* HTML
 * ------ */

function minify() {
	return gulp
		.src(options.pug.src)
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(options.pug.dest))
		.pipe(
				browsersync.reload({
					stream: true
				})
		)		
}			


/* Images
 * ------ */

function images() {
	return gulp
		.src(options.images.src)
		// .pipe(
		// 	cache(
		// 		imagemin({
		// 			interlaced: true
		// 		})
		// 	)
		// )		
		.pipe(gulp.dest(options.images.dest))
		.pipe(
			browsersync.reload({
				stream: true
			})
		);
}

function files() {
	return gulp
		.src(options.files.src)
		// .pipe(
		// 	cache(
		// 		imagemin({
		// 			interlaced: true
		// 		})
		// 	)
		// )
		.pipe(gulp.dest(options.files.dest))
		.pipe(
			browsersync.reload({
				stream: true
			})
		);
}

/* Fonts
 * ------ */

function fonts() {
	return gulp.src(options.fonts.src).pipe(gulp.dest(options.fonts.dest));
}

/* Clean up
 * ------ */

async function clean() {
	return Promise.resolve(del.sync("public"));
}

function watchFiles() {
	gulp.watch(options.pug.src, minify);
	gulp.watch(options.styles.src, styles);
	gulp.watch(options.css.src, css);
	gulp.watch(options.scripts.src, scripts);
	gulp.watch(options.fonts.src, fonts);
	gulp.watch(options.images.src, images);
	gulp.watch(options.files.src, files);
}

/* Build
 * ------ */
const build = gulp.series(
	clean,
	gulp.parallel(styles, css, minify, scripts, images, files, fonts)
);
const watch = gulp.parallel(watchFiles, browserSync);
// export tasks
exports.styles = styles;
exports.css = css;
exports.minify = minify;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
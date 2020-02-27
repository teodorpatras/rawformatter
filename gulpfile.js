const gulp = require("gulp");
const del = require("del");
const zip = require("gulp-zip");
const jeditor = require("gulp-json-editor");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const eslint = require("gulp-eslint");
const uglify = require("gulp-uglify");
const manifest = require("./src/manifest");

const { series } = gulp;
const withoutHotReload = scripts =>
  scripts.filter(s => !s.includes("hot-reload"));

gulp.task("cleanDist", () => del("dist/**", { force: true }));

gulp.task("copyManifest", () =>
  gulp
    .src("src/manifest.json")
    .pipe(
      jeditor(json => {
        const result = {};
        Object.keys(json).forEach(key => {
          result[key] = json[key];
          if (key === "background") {
            result[key] = json[key];
            const { scripts } = json[key];
            result[key].scripts = withoutHotReload(scripts);
          }
        });
        return result;
      })
    )
    .pipe(gulp.dest("dist/build"))
);

gulp.task("copyCodeMirror", () =>
  gulp.src("src/codemirror/**").pipe(gulp.dest("dist/build/codemirror"))
);

gulp.task("copyImg", () =>
  gulp.src("src/img/**").pipe(gulp.dest("dist/build/img"))
);

gulp.task("eslint", () =>
  gulp
    .src("src/js/**/*.js")
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
);

gulp.task("uglify", () =>
  gulp
    .src(["src/js/**/*.js"])
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist/build/js"))
);

gulp.task("zipAll", () => {
  const distFileName = `${manifest.name}v${manifest.version}.zip`;
  return gulp
    .src(["dist/build/**"])
    .pipe(zip(distFileName))
    .pipe(gulp.dest("dist"));
});

const tasks = [
  "cleanDist",
  "eslint",
  "uglify",
  "copyImg",
  "copyCodeMirror",
  "copyManifest",
  "zipAll"
];
// run all tasks after build directory has been cleaned
gulp.task("default", series(...tasks));

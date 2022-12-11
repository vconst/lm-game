const esbuild = require("esbuild");

esbuild.buildSync({
    bundle: true,
    sourcemap: true,
    target: "es6",
    keepNames: true,
    logLevel: "silent",
    entryPoints: ["src/main.js"],
    outfile: "dist/main.js",
});

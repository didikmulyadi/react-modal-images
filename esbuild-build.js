const { build } = require("esbuild");
const { dependencies = {} } = require("./package.json");

const OUTPUT_DIRECTORY = "dist";
const entryFile = "src/index.tsx";

const shared = {
  bundle: true,
  entryPoints: [entryFile],
  // Treat all dependencies in package.json as externals to keep bundle size to a minimum
  external: Object.keys(dependencies),
  logLevel: "info",
  minify: true,
  sourcemap: true,
};

build({
  ...shared,
  format: "esm",
  outfile: `./${OUTPUT_DIRECTORY}/index.esm.js`,
  target: ["esnext", "node12.22.0"],
});

build({
  ...shared,
  format: "cjs",
  outfile: `./${OUTPUT_DIRECTORY}/index.cjs.js`,
  target: ["esnext", "node12.22.0"],
});

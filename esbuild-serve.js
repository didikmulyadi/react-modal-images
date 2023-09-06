const { build } = require("esbuild");
const chokidar = require("chokidar");
const liveServer = require("live-server");

(async () => {
  await build({
    bundle: true,
    // Defines env variables for bundled JavaScript; here `process.env.NODE_ENV`
    // is propagated with a fallback.
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    },
    entryPoints: ["src/dev.tsx"],
    minify: process.env.NODE_ENV === "production",
    outfile: "public/script.js",
    sourcemap: true,
  });
  // `chokidar` watcher source changes.

  // `liveServer` local server for hot reload.
  liveServer.start({
    // Opens the local server on start.
    open: true,
    // Uses `PORT=...` or 8080 as a fallback.
    port: +process.env.PORT || 8080,
    // Uses `public` as the local server folder.
    root: "public",
  });
})();

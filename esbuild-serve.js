const { context } = require("esbuild");

(async () => {
  const SERVE_DIRECTORY = "docs";
  const PORT = +process.env.PORT || 8080;

  const ctx = await context({
    entryPoints: ["src/dev.tsx"],
    bundle: true,
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    outfile: `${SERVE_DIRECTORY}/script.js`,
  });

  await ctx.watch();

  await ctx
    .serve({
      servedir: SERVE_DIRECTORY,
      port: PORT,
    })
    .then(() => {
      console.log(`http://localhost:${PORT} is started`);
    })
    .catch((err) => {
      console.error("Something went wrong", err);
    });
})();

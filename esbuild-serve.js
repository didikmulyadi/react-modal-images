const { context } = require("esbuild");

(async () => {
  const PORT = +process.env.PORT || 8080;

  const ctx = await context({
    entryPoints: ["src/dev.tsx"],
    bundle: true,
    minify: process.env.NODE_ENV === "production",
    outfile: "public/script.js",
  });

  await ctx.watch();

  await ctx
    .serve({
      servedir: "public",
      port: PORT,
    })
    .then(() => {
      console.log(`http://localhost:${PORT} is started`);
    })
    .catch((err) => {
      console.error("Something went wrong", err);
    });
})();

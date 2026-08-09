"use strict";

/**
 * Builds every theme package and assembles the publishable tree.
 *
 * Each theme keeps its own toolchain (they span webpack 4 to 5 and React 16 to
 * 18), so each is built in its own workspace and its output is copied to
 * build/<theme>. That layout is the contract PRSS resolves against: the app
 * fetches manifest.json, index.html, theme.css, client.js and <template>.js
 * relative to whatever base URL the API hands it.
 */

const fs = require("fs-extra");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const packagesDir = path.join(root, "packages");
const outDir = path.join(root, "build");

const listThemes = () =>
  fs
    .readdirSync(packagesDir)
    .filter((name) => !name.startsWith("_"))
    .filter((name) => fs.existsSync(path.join(packagesDir, name, "package.json")));

const buildTheme = (theme) => {
  const cwd = path.join(packagesDir, theme);
  const pkg = fs.readJsonSync(path.join(cwd, "package.json"));

  // The blank starter ships hand-written templates and has nothing to compile.
  if (!pkg.scripts || !pkg.scripts.build) {
    process.stdout.write(`  ${theme} ... prebuilt\n`);
    return;
  }

  process.stdout.write(`  building ${theme} ... `);
  // Every theme's build is a plain node script. Invoking node directly avoids
  // spawning npm through a shell, which Windows requires for .cmd shims and
  // which would leave the arguments unescaped.
  const script = pkg.scripts.build.trim();
  if (!script.startsWith("node ")) {
    throw new Error(`${theme}: expected a node build script, got "${script}"`);
  }
  execFileSync(process.execPath, script.slice(5).trim().split(/\s+/), {
    cwd,
    stdio: "pipe",
  });
  console.log("ok");
};

/**
 * Copies a theme's output into the publish tree, without source maps.
 *
 * Maps embed sourcesContent — the complete original TypeScript — so publishing
 * them puts a theme's source on a public CDN regardless of how the repo is
 * configured. They stay in packages/<theme>/build for local debugging.
 */
const collect = (theme) => {
  const from = path.join(packagesDir, theme, "build");
  if (!fs.existsSync(from)) {
    throw new Error(`${theme} produced no build/ output`);
  }

  const to = path.join(outDir, theme);
  fs.copySync(from, to, { filter: (src) => !src.endsWith(".map") });

  // Without the map, the trailing reference is just a 404 whenever devtools open.
  fs.readdirSync(to)
    .filter((name) => name.endsWith(".js") || name.endsWith(".css"))
    .forEach((name) => {
      const file = path.join(to, name);
      const body = fs.readFileSync(file, "utf8");
      const stripped = body.replace(/\r?\n?\/[/*]# sourceMappingURL=[^\s*]+(\s*\*\/)?\s*$/, "");
      if (stripped !== body) fs.writeFileSync(file, stripped);
    });
};

const start = () => {
  const only = process.argv.includes("--theme")
    ? process.argv[process.argv.indexOf("--theme") + 1]
    : null;

  const themes = only ? [only] : listThemes();
  if (only && !fs.existsSync(path.join(packagesDir, only))) {
    throw new Error(`Unknown theme "${only}"`);
  }

  // A partial build must not wipe the other themes out of the published tree.
  if (only) fs.removeSync(path.join(outDir, only));
  else fs.emptyDirSync(outDir);

  console.log(`Building ${themes.length} theme(s):`);
  themes.forEach((theme) => {
    buildTheme(theme);
    collect(theme);
  });

  console.log(`\nAssembled ${themes.length} theme(s) into build/`);
};

start();

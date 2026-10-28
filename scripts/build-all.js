"use strict";

/**
 * Builds supported SSR theme packages and assembles static distribution artifacts.
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
    .filter((name) => name !== "blank" && !name.startsWith("_"))
    .filter((name) => fs.existsSync(path.join(packagesDir, name, "package.json")));

const requireSSR = (theme, manifestPath) => {
  if (!fs.existsSync(manifestPath) || fs.readJsonSync(manifestPath).isSSR !== true) {
    throw new Error(`${theme}: manifest must declare isSSR: true for static distribution`);
  }
};

const buildTheme = (theme) => {
  const cwd = path.join(packagesDir, theme);
  const pkg = fs.readJsonSync(path.join(cwd, "package.json"));

  // A theme may ship prebuilt SSR templates without a compilation step.
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
    // Themes emit source maps by default so they stay debuggable; maps embed
    // the original source, so the tree that gets published must not have any.
    env: { ...process.env, PRSS_NO_SOURCE_MAPS: "1" },
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

  requireSSR(theme, path.join(from, "manifest.json"));

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
  const themeArg = process.argv.indexOf("--theme");
  const only = themeArg === -1 ? null : process.argv[themeArg + 1];
  const available = listThemes();

  if (themeArg !== -1 && (!only || !available.includes(only))) {
    throw new Error(`Unknown or unsupported theme "${only || ""}"; select a supported SSR theme`);
  }

  const themes = only ? [only] : available;
  // Validate source manifests before compiling or changing the artifact tree.
  themes.forEach((theme) =>
    requireSSR(theme, path.join(packagesDir, theme, "public", "manifest.json"))
  );

  // Never retain the archived non-SSR starter, even during a partial build.
  fs.removeSync(path.join(outDir, "blank"));
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

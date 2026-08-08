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
  process.stdout.write(`  building ${theme} ... `);
  execFileSync("npm", ["run", "build"], { cwd, stdio: "pipe", shell: true });
  console.log("ok");
};

const collect = (theme) => {
  const from = path.join(packagesDir, theme, "build");
  if (!fs.existsSync(from)) {
    throw new Error(`${theme} produced no build/ output`);
  }
  fs.copySync(from, path.join(outDir, theme));
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

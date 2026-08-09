"use strict";

/**
 * Guards the contract PRSS resolves against before anything is published.
 *
 * The app fetches these paths relative to the theme's base URL, and a missing
 * index.html is the worst failure mode there is: the CDN answers the 404 page,
 * which then gets rendered and deployed as the site's HTML shell.
 */

const fs = require("fs-extra");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "build");
const packagesDir = path.join(root, "packages");

const problems = [];

const check = (theme, file) => {
  if (!fs.existsSync(path.join(outDir, theme, file))) {
    problems.push(`${theme}: missing ${file}`);
  }
};

/**
 * Source maps embed sourcesContent — the complete original TypeScript — so a
 * theme that emits them is one packaging mistake away from publishing its own
 * source. They are never used at runtime, so no theme should generate any.
 */
const checkNoMapsConfigured = () => {
  const configs = ["webpack.config.js", "clientScript.webpack.config.js"];
  fs.readdirSync(packagesDir)
    .filter((name) => !name.startsWith("_"))
    .forEach((theme) => {
      configs.forEach((name) => {
        const file = path.join(packagesDir, theme, name);
        if (!fs.existsSync(file)) return;
        const body = fs.readFileSync(file, "utf8");
        const match = body.match(/devtool:\s*([^,\r\n]+)/);
        if (match && match[1].trim() !== "false") {
          problems.push(`${theme}/${name}: devtool must be false, found ${match[1].trim()}`);
        }
      });
    });
};

const start = () => {
  if (!fs.existsSync(outDir)) {
    throw new Error("build/ does not exist — run npm run build first");
  }

  const themes = fs.readdirSync(outDir).filter((name) =>
    fs.statSync(path.join(outDir, name)).isDirectory()
  );

  if (!themes.length) throw new Error("build/ contains no themes");

  checkNoMapsConfigured();

  themes.forEach((theme) => {
    const themeDir = path.join(outDir, theme);

    // Source maps embed the original TypeScript; publishing one leaks the theme.
    fs.readdirSync(themeDir)
      .filter((name) => name.endsWith(".map"))
      .forEach((name) => problems.push(`${theme}: ${name} must not be published`));

    const manifestPath = path.join(themeDir, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      problems.push(`${theme}: missing manifest.json`);
      return;
    }

    const manifest = fs.readJsonSync(manifestPath);
    check(theme, "index.html");
    check(theme, "thumbnail.png");
    // Forking a theme swaps this in as the derived theme's thumbnail.
    check(theme, "defaultThumbnail.png");
    if (manifest.combinedCSS) check(theme, "theme.css");
    if (manifest.clientScript) check(theme, "client.js");

    (manifest.templates || []).forEach((template) => check(theme, `${template}.js`));

    if (!manifest.templates || !manifest.templates.length) {
      problems.push(`${theme}: manifest declares no templates`);
    }
  });

  if (problems.length) {
    console.error("Build verification failed:\n  " + problems.join("\n  "));
    process.exit(1);
  }

  console.log(`Verified ${themes.length} theme(s).`);
};

start();

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

const problems = [];

const check = (theme, file) => {
  if (!fs.existsSync(path.join(outDir, theme, file))) {
    problems.push(`${theme}: missing ${file}`);
  }
};

/**
 * Source maps embed sourcesContent — the complete original TypeScript — so one
 * reaching the published tree publishes the theme's source. Themes still emit
 * them for local debugging, which is exactly why this checks the output rather
 * than trusting the build to have been run the right way.
 */
const checkNoMaps = (theme) => {
  const themeDir = path.join(outDir, theme);

  fs.readdirSync(themeDir)
    .filter((name) => name.endsWith(".map"))
    .forEach((name) => problems.push(`${theme}: ${name} must not be published`));

  fs.readdirSync(themeDir)
    .filter((name) => name.endsWith(".js") || name.endsWith(".css"))
    .forEach((name) => {
      const body = fs.readFileSync(path.join(themeDir, name), "utf8");
      if (body.includes("sourcesContent")) {
        problems.push(`${theme}: ${name} contains inlined source`);
      } else if (body.includes("sourceMappingURL")) {
        problems.push(`${theme}: ${name} still references a source map`);
      }
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

  themes.forEach((theme) => {
    const themeDir = path.join(outDir, theme);

    checkNoMaps(theme);

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

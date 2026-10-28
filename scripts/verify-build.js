"use strict";

/**
 * Guards the contract PRSS resolves against before anything is published.
 *
 * The app fetches these paths relative to the theme's base URL, and a missing
 * index.html is the worst failure mode there is: the CDN answers the 404 page,
 * which then gets rendered and deployed as the site's HTML shell.
 *
 * It also type-checks nothing — babel-loader strips types without resolving
 * names — so an undefined identifier used to reach the CDN and throw at render
 * time. `checkSourceGlobals` closes that hole.
 *
 * Keep this file in sync across the free and premium theme repositories.
 */

const fs = require("fs-extra");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "build");

const problems = [];

/**
 * Globals a theme may legitimately reach for. Everything else in theme source is
 * an import or a local, so an unresolved name is a bug — the docs theme once
 * shipped `content={body}`, which built cleanly and then threw for every page
 * using that template, deploying sites with the page silently missing.
 */
const ALLOWED_GLOBALS = new Set([
  // Language
  "globalThis", "console", "Object", "Array", "String", "Number", "Boolean",
  "Symbol", "BigInt", "Math", "JSON", "Date", "RegExp", "Error", "TypeError",
  "Promise", "Set", "Map", "WeakMap", "WeakSet", "Proxy", "Reflect", "Intl",
  "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent",
  "decodeURIComponent", "encodeURI", "decodeURI", "structuredClone",
  "queueMicrotask", "undefined", "NaN", "Infinity",
  // Browser
  "window", "document", "navigator", "location", "history", "localStorage",
  "sessionStorage", "fetch", "URL", "URLSearchParams", "AbortController",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "requestAnimationFrame", "cancelAnimationFrame", "getComputedStyle",
  "IntersectionObserver", "MutationObserver", "ResizeObserver",
  "Event", "CustomEvent", "Element", "HTMLElement", "Node", "NodeList",
  "Image", "FormData", "Headers", "Request", "Response", "Blob", "FileReader",
  "alert", "confirm", "prompt", "matchMedia", "scrollTo", "CSS",
  // Build/runtime
  "process", "require", "module", "exports", "__dirname", "JSX", "NodeJS",
]);

const collectSourceFiles = (dir, acc = []) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectSourceFiles(full, acc);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) acc.push(full);
  });
  return acc;
};

/** Fail on identifiers that resolve to nothing — the class of bug babel cannot see. */
const checkSourceGlobals = (theme) => {
  const srcDir = path.join(root, "packages", theme, "src");
  if (!fs.existsSync(srcDir)) return;

  collectSourceFiles(srcDir).forEach((file) => {
    // Ambient declarations exist precisely to introduce free names.
    if (file.endsWith(".d.ts")) return;

    let ast;
    try {
      ast = parse(fs.readFileSync(file, "utf8"), {
        sourceType: "module",
        plugins: ["typescript", "jsx", "classProperties", "dynamicImport"],
      });
    } catch (e) {
      problems.push(`${theme}: ${path.relative(root, file)} failed to parse — ${e.message}`);
      return;
    }

    traverse(ast, {
      ReferencedIdentifier(idPath) {
        const { name } = idPath.node;
        if (ALLOWED_GLOBALS.has(name)) return;
        if (idPath.scope.hasBinding(name, true)) return;
        // Types are erased by babel and may be declared anywhere (or ambiently).
        if (idPath.findParent((p) => p.node.type.startsWith("TS"))) return;

        const line = idPath.node.loc ? idPath.node.loc.start.line : "?";
        problems.push(
          `${theme}: ${path.relative(root, file)}:${line} uses undefined '${name}'`
        );
      },
    });
  });
};

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

  // Older local builds may still contain the archived non-SSR starter.
  // It is not a release artifact; build-all removes it when assembling output.
  const themes = fs.readdirSync(outDir).filter((name) =>
    name !== "blank" && fs.statSync(path.join(outDir, name)).isDirectory()
  );

  if (!themes.length) throw new Error("build/ contains no themes");

  themes.forEach((theme) => {
    const themeDir = path.join(outDir, theme);

    checkNoMaps(theme);
    checkSourceGlobals(theme);

    const manifestPath = path.join(themeDir, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      problems.push(`${theme}: missing manifest.json`);
      return;
    }

    const manifest = fs.readJsonSync(manifestPath);
    if (manifest.isSSR !== true) {
      problems.push(`${theme}: manifest must declare isSSR: true for static distribution`);
    }
    check(theme, "index.html");
    // thumbnail.png is optional — PRSS draws a generated cover when it 404s.
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

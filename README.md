# PRSS themes

The official PRSS themes, developed in one repo and published as a single npm
package, `@prss/themes`.

PRSS resolves a theme against a base URL handed to it by the API, and fetches
`manifest.json`, `index.html`, `theme.css`, `client.js` and one `<template>.js`
per template relative to it. The published package mirrors that layout:

```
build/
  vantage/{manifest.json,index.html,theme.css,client.js,home.js,...}
  slate/{...}
```

so the API points a theme at `.../@prss/themes@<version>/build/<theme>`.

## Layout

```
packages/
  _shared/     component layer shared by the themes (not published on its own)
  vantage/     one workspace per theme, each with its own build toolchain
  ...
scripts/
  build-all.js   builds every theme and assembles build/
  verify-build.js  checks each theme ships the files PRSS will ask for
```

Themes span webpack 4 to 5 and React 16 to 18, so each keeps its own
`package.json` and toolchain rather than sharing a hoisted one. Only the built
output is published, so this is invisible to consumers.

`_shared` is consumed as **source**, not as a built dependency: each theme
compiles it with its own Tailwind config, so the shared components pick up that
theme's design tokens. Themes reach it through the `@/components/ui`, `@/hooks`
and `@/lib` aliases; everything else under `@/` stays theme-local.

## Working on a theme

```bash
npm install                       # once, at the repo root
npm run build:theme -- vantage    # build one theme
npm run build                     # build all themes and assemble build/
npm run verify                    # check the published layout is complete
```

Each theme's own `build/` is committed. PRSS's theme creator clones a single
theme with a sparse checkout and reads `build/manifest.json` immediately, so a
theme directory has to be complete and forkable on its own.

## Reproducible builds

The root `package-lock.json` is committed and is what makes builds
reproducible. Neither Babel nor browserslist targets are declared explicitly, so
bundle contents otherwise drift with whatever `caniuse-lite` happens to be
installed. Run `npm ci` rather than `npm install` when you need to match a
previous build exactly.

## Premium themes

Paid themes live in a separate private repo and publish as
`@prss/premium-themes`. They are not forkable through the theme creator, which
filters them out of the base-theme list.

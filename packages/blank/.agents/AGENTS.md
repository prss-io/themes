# AGENTS.md — @hodgef/blank-theme (Blank — Legacy)

A **PRSS theme** — the original, minimal "blank" starter. It is a **legacy
prototype** kept for backward compatibility with existing sites; new blank sites
should prefer **`@hodgef/blank-ssr-theme`** (the SSR starter).

| | |
| --- | --- |
| npm | `@hodgef/blank-theme` |
| Version | `2.0.9` |
| Manifest | `Prototype: Blank (Legacy)` / `blog` — `parser: react` |
| SSR | No (client-rendered) — `isSSR` not set |
| siteVars | 0 |
| Contents (this checkout) | build-only: `build/` (compiled `home.js`, `blog.js`, `card.js`, `docs.js`, `page.js`, `post.js`, `manifest.json`, `index.html`, thumbnails). No `src/`. |

## What a PRSS theme is

A PRSS theme provides a compiled component per page type (`build/<template>.js`, a
global `PRSSComponent`) that the **PRSS app** uses to render a site, feeding it
post + site data through the **`@prss/ui`** runtime (global `PRSS`). The theme is
published to npm and loaded by the PRSS app from a CDN.

Because this is a legacy, non-SSR theme, it renders on the client rather than
during the server-side build, and ships no `siteVars`. It has no source templates
in this checkout — only the compiled `build/` output.

## manifest.json

`title: "Prototype: Blank (Legacy)"`, `type: "blog"`, `parser: "react"`. No
`isSSR`, `combinedCSS`, `clientScript`, or `siteVars`.

## Runtime API (@prss/ui)

Compiled templates call `PRSS.*`: `init(data)`, `getProp(path)`,
`getItems(template?, sort?)`, etc. Full reference: the `@prss/ui` package.

## Maintenance

- This theme is legacy; prefer contributing new work to `@hodgef/blank-ssr-theme`
  or the `@prss/*` themes.
- If a change is unavoidable: publish = bump the version → `npm publish` → commit
  + push. The theme is then available on npm/CDN for the PRSS app to load.

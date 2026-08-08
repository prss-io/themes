# AGENTS.md — @hodgef/blank-ssr-theme (Blank SSR)

A **PRSS theme** — a React component library the PRSS app renders to build static
sites. **Blank SSR** is a minimal, unstyled **SSR starter** — the leanest base for
building a new SSR theme from scratch.

| | |
| --- | --- |
| npm | `@hodgef/blank-ssr-theme` |
| Version | `1.0.3` |
| Manifest | `Blank SSR` / `blog` — `parser: react`, `isSSR: true` |
| Flags | `combinedCSS`/`clientScript` not set (minimal) |
| Templates | `blog, card, docs, home, page, post` |
| siteVars | 3 (minimal) |

## What a PRSS theme is

Each `src/<template>/index.tsx` exports a component that the **PRSS app**
server-side renders when building a site, fed the current post + site data through
the **`@prss/ui`** runtime (global `PRSS`). Templates compile to
`build/<template>.js` (a global `PRSSComponent`) plus a merged `theme.css`;
published to npm and loaded by the PRSS app from a CDN.

## Structure

`src/<template>/index.tsx` · `src/_common` (`lib/clientScript.ts`, `styles/`,
optional `components/ui/`) · `public/manifest.json` · `build/`. Minimal chrome by
design — add components as you build the theme up.

## Template contract

```tsx
const Home = data => {
  PRSS.init(data);
  const posts = PRSS.getItems("post", true);
  return (<main className="page-home">{/* render posts */}</main>);
};
export default Home;
```

`@prss/ui`, `react`, `react-dom` are webpack **externals** — provided globally by
the PRSS app, never bundled.

## manifest.json

`title`, `type`, `parser: "react"`, `isSSR: true`, `siteVars` (only 3 here). This
theme omits `combinedCSS`/`clientScript`; enable them if the theme grows to need a
merged CSS bundle or a client script. Build injects `name`/`version`.

## Runtime API (@prss/ui)

`init(data)`, `getProp(path)`, `getJsonProp(path)`,
`getItems(template?, sort?, override?, category?)`, `getItem(uuid)`,
`getItemBySlug(slug)`, `getComponent(slug)`, `getStructurePaths`, `walkStructure`,
`getSiteUrl`, `getPathUrl`, `formattedDate`, `timeAgo`, `stripTags`,
`truncateString`; editor blocks via `PRSS.ContentRenderer`. Full reference: the
`@prss/ui` package.

## Build, test, publish

- Build: `npm run build`; Test: `npm test`; Lint: `npm run lint`.
- Publish: bump the version → `npm publish` → commit + push. The theme is then
  available on npm/CDN for the PRSS app to load.

## Styling & guidelines

Keep it minimal, but still support light/dark via the `dark` class and avoid inline
styles; editor blocks come from `@prss/ui`.

## Local development

Install an in-progress `@prss/ui` as a local dependency and rebuild; verify
visually in the PRSS app.

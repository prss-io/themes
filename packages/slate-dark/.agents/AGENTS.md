# AGENTS.md — @prss/slate-dark-theme (Slate Dark)

A **PRSS theme** — a React component library the PRSS app renders to build static
sites. **Slate Dark** is the dark-styled variant of Slate; structurally identical,
differing in styling/defaults.

| | |
| --- | --- |
| npm | `@prss/slate-dark-theme` |
| Version | `3.5.1` |
| Manifest | `Slate Dark` / `blog` — `parser: react`, `isSSR`, `combinedCSS`, `clientScript` |
| Templates | `blog, card, docs, home, page, post` |
| siteVars | 21 |
| Layout components | `src/resources/components/` (Header, Footer, Aside, Head, Page) + `_common/components/ui/` shadcn |

## What a PRSS theme is

Each `src/<template>/index.tsx` exports a component that the **PRSS app**
server-side renders when building a site, fed the current post + site data through
the **`@prss/ui`** runtime (global `PRSS`). Templates compile to
`build/<template>.js` (a global `PRSSComponent`) plus a merged `theme.css`;
published to npm and loaded by the PRSS app from a CDN.

## Structure

`src/<template>/index.tsx` · `src/resources/components` (page chrome) ·
`src/_common` (`components/ui/` shadcn, `lib/clientScript.ts`, `styles/`) ·
`public/manifest.json` · `build/`.

## Template contract

```tsx
const Home = data => {
  PRSS.init(data);
  const vars = PRSS.getProp("vars");
  const posts = PRSS.getItems("post", true);
  return (<Page className="page-home"><Header /><main>{/* ... */}</main><Footer /></Page>);
};
export default Home;
```

`@prss/ui`, `react`, `react-dom` are webpack **externals** — provided globally by
the PRSS app, never bundled.

## manifest.json

`title`, `type`, `parser: "react"`, `isSSR`, `combinedCSS`, `clientScript`,
`siteVars`. Build injects `name`/`version`.

## Runtime API (@prss/ui)

`init(data)`, `getProp(path)`, `getJsonProp(path)`,
`getItems(template?, sort?, override?, category?)`, `getItem(uuid)`,
`getItemBySlug(slug)`, `getComponent(slug)`, `getStructurePaths`, `walkStructure`,
`getSiteUrl`, `getPathUrl`, `formattedDate`, `timeAgo`, `stripTags`,
`truncateString`; editor blocks via `PRSS.ContentRenderer`. Full reference: the
`@prss/ui` package.

## Build, test, publish

- Build: `npm run build`; Test: `npm test`; Lint: `npm run lint`.
- Publish: bump the version → `npm publish` → commit + push. Keep in sync with
  `slate-theme` where changes are shared.

## Styling & guidelines

TailwindCSS + shadcn/ui + component CSS; this theme defaults to dark — keep the
`dark` class behavior intact and ensure both modes render; no inline styles; editor
blocks come from `@prss/ui`.

## Local development

Install an in-progress `@prss/ui` as a local dependency and rebuild; verify
visually in the PRSS app.

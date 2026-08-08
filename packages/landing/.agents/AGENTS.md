# AGENTS.md — @prss/landing-theme (Landing)

A **PRSS theme** — a React component library the PRSS app renders to build static
sites. **Landing** is a landing-page / showcase theme (marketing hero, sections);
its manifest `type` is `showcase` (most others are `blog`).

| | |
| --- | --- |
| npm | `@prss/landing-theme` |
| Version | `3.5.3` |
| Manifest | `Landing` / `showcase` — `parser: react`, `isSSR`, `combinedCSS`, `clientScript` |
| Templates | `blog, card, docs, home, page, post` |
| siteVars | 25 (incl. Hero content/imagery) |
| Layout components | `src/resources/components/` (Header, Footer, Aside, Hero, Head, Page) + `_common/components/ui/` shadcn |

## What a PRSS theme is

Each `src/<template>/index.tsx` exports a component that the **PRSS app**
server-side renders when building a site, fed the current post + site data through
the **`@prss/ui`** runtime (global `PRSS`). Templates compile to
`build/<template>.js` (a global `PRSSComponent`) plus a merged `theme.css`;
published to npm and loaded by the PRSS app from a CDN.

## Structure

`src/<template>/index.tsx` · `src/resources/components` (Header, Footer, Aside,
Hero, Page) · `src/_common` (`components/ui/` shadcn, `lib/clientScript.ts`,
`styles/`) · `public/manifest.json` · `build/`.

## Template contract

```tsx
const Home = data => {
  PRSS.init(data);
  const vars = PRSS.getProp("vars");   // heroTitle, heroMessage, heroImageUrl, ...
  return (<Page className="page-home"><Header /><Hero /><main>{/* ... */}</main><Footer /></Page>);
};
export default Home;
```

`@prss/ui`, `react`, `react-dom` are webpack **externals** — provided globally by
the PRSS app, never bundled.

## manifest.json

`title`, `type: "showcase"`, `parser: "react"`, `isSSR`, `combinedCSS`,
`clientScript`, `siteVars` (hero + SEO + layout). Build injects `name`/`version`.

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

TailwindCSS + shadcn/ui + component CSS; support light/dark via the `dark` class;
no inline styles; editor blocks come from `@prss/ui`.

## Local development

Install an in-progress `@prss/ui` as a local dependency and rebuild; verify
visually in the PRSS app.

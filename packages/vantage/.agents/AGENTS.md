# AGENTS.md — @prss/vantage-theme (Vantage)

A **PRSS theme** — a React component library the PRSS app renders to build static
sites. **Vantage** is a business / corporate theme that ships **alternate layout
templates** (`blog2`, `post2`) in addition to the standard set.

| | |
| --- | --- |
| npm | `@prss/vantage-theme` |
| Version | `1.4.2` |
| Manifest | `Vantage` / `blog` — `parser: react`, `isSSR`, `combinedCSS`, `clientScript` |
| Templates | `blog, blog2, card, docs, home, page, post, post2` |
| siteVars | 22 |
| Layout components | `src/_common/components/` (Aside, Borders, Footer, Header, Page) + `ui/` shadcn |

`blog2`/`post2` are alternate list/post layouts — each is its own
`src/<name>/index.tsx` → `build/<name>.js`. A post uses one based on its
`template` value (chosen in the PRSS app).

## What a PRSS theme is

Each `src/<template>/index.tsx` exports a component that the **PRSS app**
server-side renders when building a site, fed the current post + site data through
the **`@prss/ui`** runtime (global `PRSS`). Templates compile to
`build/<template>.js` (a global `PRSSComponent`) plus a merged `theme.css`;
published to npm and loaded by the PRSS app from a CDN.

## Structure

`src/<template>/index.tsx` (incl. `blog2`, `post2`) · `src/_common`
(`components/` incl. Header/Footer/Aside/Page and `ui/` shadcn,
`lib/clientScript.ts`, `styles/`) · `public/manifest.json` · `build/`.

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
`siteVars`. Build injects `name`/`version`. Alternate templates (`blog2`, `post2`)
appear as selectable templates in the PRSS app.

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

TailwindCSS + shadcn/ui (`_common/components/ui`) + component CSS; support
light/dark via the `dark` class; no inline styles; editor blocks come from
`@prss/ui`.

## Local development

Install an in-progress `@prss/ui` as a local dependency and rebuild; verify
visually in the PRSS app.

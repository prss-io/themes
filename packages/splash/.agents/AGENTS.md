# AGENTS.md — @prss/splash-theme (Splash)

A **PRSS theme** — a React component library the PRSS app renders to build static
sites. **Splash** is the shadcn-inspired theme and a good **starting point for
building custom themes**.

| | |
| --- | --- |
| npm | `@prss/splash-theme` |
| Version | `1.3.4` |
| Manifest title / type | `Splash` / `blog` |
| Flags | `parser: react`, `isSSR`, `combinedCSS`, `clientScript` |
| Templates | `blog, card, docs, home, page, post` |
| siteVars | 26 |
| Shared components | `src/_common/components/` (Header, Footer, Aside, Borders, Page + `ui/` shadcn) |

This repo also carries theme-family guidance in `.github/copilot-instructions.md`
and `.github/prompts/` (`create-block`, publish prompts).

## What a PRSS theme is

Each `src/<template>/index.tsx` exports a component that the **PRSS app**
server-side renders when building a site, fed the current post + site data through
the **`@prss/ui`** runtime (exposed as the global `PRSS`). Each template compiles
to `build/<template>.js` (a global `PRSSComponent`) plus a merged `theme.css`. The
theme is published to npm and loaded by the PRSS app from a CDN.

## Structure

```
src/
  <template>/index.tsx   # home, post, page, blog, card, docs
  _common/
    components/           # shared components (+ ui/ = shadcn primitives)
    lib/clientScript.ts   # client-side JS (dark mode, interactions; no React)
    lib/utils.ts, styles/
public/manifest.json      # theme config + siteVars
build/                    # compiled per-template .js + theme.css + client.js + manifest.json
```

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

`@prss/ui`, `react`, `react-dom` are webpack **externals** (`PRSS`, `React`,
`ReactDOM`) — provided globally by the PRSS app, never bundled by the theme.

## manifest.json

Describes the theme to the PRSS app: `title`, `type`, `parser: "react"`, `isSSR`,
`combinedCSS`, `clientScript`, and `siteVars`
(`{ <name>: { type: "string"|"image"|"url", description } }` — hero text/images,
SEO meta, menus, …). The build injects `name`/`version` into `build/manifest.json`.

## Runtime API (@prss/ui)

Call globally as `PRSS.*`: `init(data)`, `getProp(path)`, `getJsonProp(path)`,
`getItems(template?, sort?, override?, category?)`, `getItem(uuid)`,
`getItemBySlug(slug)`, `getComponent(slug)`, `getStructurePaths`, `walkStructure`,
`getSiteUrl`, `getPathUrl`, `formattedDate`, `timeAgo`, `stripTags`,
`truncateString`. Post content with editor blocks renders via
`PRSS.ContentRenderer`. Full reference: the `@prss/ui` package.

## Build, test, publish

- Build: `npm run build` (`node scripts/build.js`).
- Test: `npm test`; Lint: `npm run lint`.
- Publish: bump the version → `npm publish` → commit + push. The theme is then
  available on npm/CDN for the PRSS app to load.

## Styling & guidelines

- TailwindCSS + shadcn/ui (`_common/components/ui`) + component CSS.
- Support light/dark via the `dark` class; don't break either mode.
- Avoid inline styles — use or extend the component's CSS file.
- Editor blocks are provided by `@prss/ui`, not per-theme.

## Local development

To test against an in-progress `@prss/ui`, install it as a local dependency and
rebuild; verify visually in the PRSS app.

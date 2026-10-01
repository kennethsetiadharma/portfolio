@AGENTS.md

# Portfolio

Single-page personal portfolio for a CS student. Recruiters must find the projects within 30 seconds.

## Rules (read first)

1. **Minimal clutter is the top priority.** Lots of whitespace, few words. Every element must earn its place; if it is decorative and doesn't help a visitor reach the projects, leave it out.
2. **Don't add libraries without asking.** Use what is installed. Ask before running `npm i` or `npx shadcn add` for anything new.
3. **Content never lives in components.** See "Content convention" below.

## Stack

- Next.js 16 (App Router, TypeScript, `src/` dir, npm), React 19
- Tailwind CSS v4 (configured in `src/app/globals.css`, no `tailwind.config`)
- shadcn/ui (`base-nova` style, Base UI primitives; components are copied into `src/components/ui/`)
- Motion (`motion/react`) for UI animation
- three + @react-three/fiber + @react-three/drei for the 3D hero
- Geist / Geist Mono via `next/font/google` in `src/app/layout.tsx`

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build (also type-checks)
- `npm run lint`: ESLint

## Visual checks

Use the Playwright MCP server to screenshot the running site after any UI change. Check desktop (1440×900) and mobile (390×844), and read the browser console for errors. Headless Chrome screenshots via the CLI are unreliable for the WebGL canvas, so don't trust a blank canvas from them.

## Structure

```
src/
  app/              routes: layout.tsx, page.tsx, globals.css
  components/ui/    shadcn components
  components/three/ 3D: HeroCanvas (gate + lazy load), HeroScene (R3F), HeroFallback
  sections/         page sections (Hero, Projects, Footer)
  content/          site.ts (name, intro, links), projects.ts (all projects)
  hooks/            client hooks
public/videos/      project preview videos + poster images
```

## Content convention

- All project data lives in `src/content/projects.ts`, typed by `Project`.
- Name, intro, and links live in `src/content/site.ts`.
- Videos and posters go in `public/videos/` and are referenced as `/videos/<file>`.
- Adding a project must only require editing `projects.ts` and adding media. If a change would force a component edit to add a project, the component is wrong.
- Optional fields (`github`, `live`, `video`) hide their UI when undefined.

## Design rules

- Background: light grey vertical gradient (set on `body` in `globals.css`).
- Headline: huge, tight, sans-serif (Geist, `tracking-tighter`, `leading-none`, fluid `clamp()` size).
- Nav: floating pill shape.
- Buttons: dark, rounded.
- One 3D hero object with chrome materials. Only one.
- Colour: neutral greys plus 1–2 vibrant accents max. The accent is `--brand` (`bg-brand`, `text-brand`). Don't confuse it with shadcn's `accent`, which is a subtle hover background.
- Use the reference sites (butter.video, landonorris.com) for vibe only. Don't copy them.

## 3D and performance

- The canvas is lazy-loaded with `next/dynamic` (`ssr: false`) inside `HeroCanvas`, so three.js is a separate chunk.
- `useCanRender3D` gates it: below 768px or with `prefers-reduced-motion: reduce`, only `HeroFallback` renders and three.js is never downloaded.
- Lighting comes from drei `<Environment>` + `<Lightformer>`s defined in code. Don't use HDR presets that fetch files from a CDN.
- Keep `dpr={[1, 2]}` on the Canvas.
- Videos must be muted, short, compressed, and always have a poster.

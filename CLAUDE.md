@AGENTS.md

# Portfolio

Single-page personal portfolio for a CS student. Recruiters must find the projects within 30 seconds.

## Rules (read first)

1. **Minimal clutter is the top priority.** Lots of whitespace, few words. Every element must earn its place; if it is decorative and doesn't help a visitor reach the projects, leave it out.
2. **Don't add libraries without asking.** Use what is installed. Ask before running `npm i` or `npx shadcn add` for anything new.
3. **Content never lives in components.** See "Content convention" below.

## Page structure & build order

Single page, in this order: Hero → About (`#about`) → Code Projects (`#work`) → Video Projects (`#videos`) → Footer, with a floating pill nav: a home icon (scrolls to top) followed by About / Work / Videos. Tick items off as they ship.

- [x] 0. Foundation: stack, content files, lazy 3D pipeline
- [x] 1. Content types + placeholder data (projects.ts, videos.ts, site.ts) + placeholder media
- [x] 2. Shared pieces: Section, Reveal/Stagger (Motion), SocialLinks, brand icons
- [x] 3. Nav: floating pill → Work / Videos / About, smooth scroll
- [x] 4. Hero: name, intro, 3D object, SocialLinks; scroll-away rotate + fade
- [x] 5. About (#about): photo + 2–3 sentences
- [x] 6. Code Projects (#work): ProjectCard grid, click-to-open preview dialog
- [x] 7. Video Projects (#videos): thumbnail grid + lightbox (YouTube click-to-load or mp4)
- [x] 8. Footer: contact line + SocialLinks
- [x] 9. Polish pass: Playwright desktop/mobile screenshots, reduced-motion, Lighthouse

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
  components/ui/    shadcn-style components (button, dialog)
  components/three/ 3D: HeroCanvas (gate + lazy load), HeroScene (R3F + motion), Die (model), die-config, HeroVisual (scroll), HeroFallback
  components/motion/ MotionProvider, Reveal, Stagger
  components/icons/ brand SVG icons (lucide v1 has no GitHub/LinkedIn)
  components/       shared leaves: Nav, Section, SocialLinks, ProjectCard, ProjectDialog, ProjectMeta, ThumbTrigger, VideoCard, VideoPlayer
  sections/         Hero, About, Projects, Videos, Footer (Server Components, map over content)
  content/          site.ts (name, intro, links, about, nav), projects.ts, videos.ts
  hooks/            client hooks
public/videos/      code-project preview clips + posters, local video-project mp4s
public/images/      your portrait (path set in site.about.photo), video-project thumbnails (images/videos/)
```

## Content convention

- All project data lives in `src/content/projects.ts`, typed by `Project`.
- All video-editing projects live in `src/content/videos.ts`, typed by `VideoProject` (each has exactly one of `youtubeId` or `src`).
- Name, intro, links, about text/photo, contact line, and nav entries live in `src/content/site.ts`.
- Clips and posters go in `public/videos/` (referenced as `/videos/<file>`); photos and thumbnails go in `public/images/`.
- Adding a project must only require editing `projects.ts` and adding media. If a change would force a component edit to add a project, the component is wrong.
- Optional fields (`github`, `live`, `video`) hide their UI when undefined.

## Design rules

- Background: light grey vertical gradient (set on `body` in `globals.css`).
- Headline: huge, tight, sans-serif (Geist, `tracking-tighter`, `leading-none`, fluid `clamp()` size).
- Nav: floating pill shape.
- Buttons: dark, rounded.
- One 3D hero object: a chrome die. The 1-face shows an extruded K loaded from `public/k.svg`; the other faces have recessed pips. Only one 3D object. Tweak it in `src/components/three/die-config.ts`.
- Colour: neutral greys plus 1–2 vibrant accents max. The one exception is the hero die's six tinted-chrome faces (colours live in `die-config.ts`); nothing else on the page may add colours. The accent is `--brand` (`bg-brand`, `text-brand`). Don't confuse it with shadcn's `accent`, which is a subtle hover background.
- Use the reference sites (butter.video, landonorris.com) for vibe only. Don't copy them.

## Animation

- Motion only (`motion/react`). No other animation libraries.
- One signature moment: the hero die settles K-forward and fades as you scroll away (`useScroll` + `useTransform`). Clicking the die rolls it and lands K-forward.
- Everything else is subtle: sections and cards fade up on enter, grids staggered, `once: true`.
- Respect `prefers-reduced-motion`: `MotionConfig reducedMotion="user"` at the root, CSS smooth scroll only under `no-preference`, no video autoplay.

## 3D and performance

- The canvas is lazy-loaded with `next/dynamic` (`ssr: false`) inside `HeroCanvas`, so three.js is a separate chunk.
- `useCanRender3D` gates it: below 768px or with `prefers-reduced-motion: reduce`, only `HeroFallback` renders and three.js is never downloaded.
- Lighting comes from drei `<Environment>` + `<Lightformer>`s defined in code. Don't use HDR presets that fetch files from a CDN.
- Keep `dpr={[1, 2]}` on the Canvas.
- Project preview clips must be muted, short, compressed, and always have a poster. The video-project lightbox player (mp4) has controls and sound, since the viewer clicked play, and still gets a poster.
- Project cards show a static poster. The demo clip only mounts (and downloads) inside the click-to-open dialog, where it plays muted and looping; with reduced motion it shows controls instead of autoplaying.
- YouTube iframes load only after a click, from `youtube-nocookie.com`. Never render an iframe on page load.

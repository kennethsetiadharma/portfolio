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
- [x] 3. Nav: floating pill → home icon + About / Work / Videos, smooth scroll
- [x] 4. Hero: name, intro, 3D object, SocialLinks; scroll-away rotate + fade
- [x] 5. About (#about): photo + 2–3 sentences
- [x] 6. Code Projects (#work): ProjectCard grid, click-to-open preview dialog
- [x] 7. Video Projects (#videos): thumbnail grid + lightbox (YouTube click-to-load or mp4)
- [x] 8. Footer: contact line + SocialLinks
- [x] 9. Polish pass: Playwright desktop/mobile screenshots, reduced-motion, Lighthouse
- [ ] 10. Launch: finish the hidden entries and real links (see "Current status"), then deploy to Vercel

## Current status (read before editing content)

Items 0–9 are built and pushed to GitHub (`kennethsetiadharma/portfolio`, branch `main`). The site is **not deployed yet**. Plan: connect the repo to Vercel, after which every push to `main` redeploys automatically (so content can be fixed after launch; no need to finish everything first).

**Real content in place:** name, intro, "Based in Burnaby, BC", email, portrait, resume PDF, GitHub and LinkedIn links, the Virus Breach and ASL gesture detector projects (with demo clips), and the SFU Kendo - Mask Off video.

**Hidden until launch** (`hidden: true` in the content file; the sections skip these, but the data stays so it is easy to restore):

| Entry | File | Why hidden |
|---|---|---|
| Group Consensus App | `projects.ts` | placeholder description, poster and live link |
| Video Two, Video Three | `videos.ts` | placeholder titles, grey thumbnails, and a placeholder YouTube ID |

To show one: replace its placeholder content, then delete its `hidden: true` line.

**Visible entries with a link removed on purpose** (the button hides itself while the field is undefined; each has a `TODO` comment in `projects.ts`):

- Virus Breach: no `github` (the repo is on SFU's private server, `github.sfu.ca`, so visitors can't open it; decision pending: copy it to github.com only if the course and teammates allow, otherwise leave it off) and no `live` (it is a desktop game).
- ASL gesture detector: no `github` yet; add the repo URL when known.

**Still to do before/around launch:** the entries above; optionally a favicon and social-share image; check `src/content/*.ts` for any leftover placeholder text (search for `example.com`, `dQw4w9WgXcQ`, `TODO`).

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
  content/          site.ts (name, intro, location, email, links, about, nav), projects.ts, videos.ts
  hooks/            client hooks
public/videos/      code-project preview clips + posters, local video-project mp4s
public/images/      your portrait (path set in site.about.photo), video-project thumbnails (images/videos/)
```

## Content convention

- All project data lives in `src/content/projects.ts`, typed by `Project`.
- All video-editing projects live in `src/content/videos.ts`, typed by `VideoProject` (each has exactly one of `youtubeId` or `src`).
- Name, intro, location, email, links, about text/photo, contact line, and nav entries live in `src/content/site.ts`.
- Clips and posters go in `public/videos/` (referenced as `/videos/<file>`); photos and thumbnails go in `public/images/`.
- Adding a project must only require editing `projects.ts` and adding media. If a change would force a component edit to add a project, the component is wrong.
- Optional fields (`github`, `live`, `video`) hide their UI when undefined.
- `hidden: true` on a project or video keeps it in the file but removes it from the page.
- YouTube IDs: only the 11-character ID after `v=` (stop before any `&`). Keep a leading `-` or `_`; dropping it makes the video fail to load.

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
- The render loop pauses (`frameloop="never"`) whenever the hero is off-screen, via `useInView` in `HeroCanvas`. Don't remove it: an off-screen die otherwise keeps burning CPU/GPU.
- Project preview clips must be muted, short, compressed, and always have a poster. The video-project lightbox player (mp4) has controls and sound, since the viewer clicked play, and still gets a poster.
- Project cards show a static poster. The demo clip only mounts (and downloads) inside the click-to-open dialog, where it plays muted and looping; with reduced motion it shows controls instead of autoplaying.
- YouTube iframes load only after a click, from `youtube-nocookie.com`. Never render an iframe on page load.

## Media workflow

- **Project demo clips:** H.264 MP4, about 1280×720, roughly 1.5–2 Mbps, a few MB (aim for under about 8 MB), muted is fine. Make it **fast-start** (the `moov` index before `mdat`) so it can play before it fully downloads. Posters are JPEGs under about 0.5 MB: 16:10 for project cards (they crop to it), 16:9 for video thumbnails.
- **No ffmpeg on this Mac, and the Swift toolchain is broken** (`SwiftBridging` module redefinition). `avconvert` works but its presets are too high-bitrate (a 21 s clip came out at 25 MB). What worked: re-encode in Chrome via the Playwright MCP (play the file onto a 1280×720 canvas, record with `MediaRecorder` as `video/mp4;codecs=avc1` at a chosen `videoBitsPerSecond`, then save it with `download.saveAs`), and fast-start with a small Python script that moves `moov` and shifts the `stco`/`co64` offsets (lossless). Posters: grab a frame with a canvas, or `sips -s format jpeg -Z 1600` for PNGs.
- Don't commit raw source recordings or huge originals (GitHub rejects files over 100 MB). Big photos are fine to keep but resize if convenient (Next optimises them at request time).
- Keep file-name capitalisation identical everywhere (`.JPG` vs `.jpg`); some hosts are case-sensitive.
- **Stale image gotcha:** if you overwrite an image under the same filename, the dev server can keep serving the old resized copy from memory. Restart `npm run dev`, or use a new filename.

## Decisions and gotchas

- Thumbnails (projects and videos) are static; hover shows a zoom and a badge (always visible on touch), and a **click** opens the lightbox. Nothing opens on hover.
- Dialogs (`ui/dialog.tsx`): the close X goes in the title row (`DialogCloseButton` with `overlayClose={false}`), never over the media, because players put controls in the top-right. The close button takes initial focus so Esc still works when an iframe is present.
- The hero headline is `clamp(3rem, 9.5vw, 9rem)` so the full name fits on one line on desktop and the whole hero (name, intro, location, email, icons) stays above the fold from 1024×768 up. Re-check this if the name or intro changes.
- Lighthouse on a production build: mobile 99 / 100 / 100 / 100; desktop performance 81, because the three.js chunk blocks the main thread for about 400 ms (inflated by software WebGL in headless Chrome). Geist Mono has `preload: false` so it doesn't compete with Geist Sans. Lighthouse was run with `npx` from a temp folder and is **not** a project dependency.
- Playwright screenshots can time out while a video is playing or the 3D canvas is busy; pause the video and pass a longer `timeout`. Navigating to the same URL with only a different `#hash` doesn't reload the page, so go through `about:blank` first.

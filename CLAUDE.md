@AGENTS.md

# Portfolio

Single-page personal portfolio for a CS student. Recruiters must find the projects within 30 seconds.

## Rules (read first)

1. **Minimal clutter is the top priority.** Lots of whitespace, few words. Every element must earn its place; if it is decorative and doesn't help a visitor reach the projects, leave it out.
2. **Don't add libraries without asking.** Use what is installed. Ask before running `npm i` or `npx shadcn add` for anything new.
3. **Content never lives in components.** See "Content convention" below.

## Page structure

Single page, in this order: Hero (name, intro, showreel) → About (`#about`) → Code Projects (`#work`) → Video Projects (`#videos`) → Footer, with a floating dark glass pill nav: a home icon (scrolls to top) followed by About / Work / Videos, highlighting the section on screen. Hero, About and Work are light; Videos and the footer are near-black.

The first version (chrome 3D die hero, card grids, all light) shipped on 2026-10-01. The redesign (November 2026) replaced the die with the showreel, made About a scroll statement, turned the project grid into full-width rows, and added the dark sections. The die code is in git history before the commit "Remove the 3D die code and three.js dependencies".

## Current status (read before editing content)

The site is **live at https://www.kennethsetiadharma.com** (Vercel, repo `kennethsetiadharma/portfolio`, branch `main`): every push to `main` redeploys automatically in about a minute, so content can be fixed after launch. Other branches get a Vercel preview URL, so do large changes on a branch. The bare domain `kennethsetiadharma.com` 308-redirects to `www`, and HTTP redirects to HTTPS (HSTS on).

Redesign checked locally on 2026-11-15 (production build): no console errors on desktop or a 390px phone; the reel, in-view project clips, Kendo YouTube lightbox and reduced-motion fallbacks all work. Lighthouse mobile 95 to 99 / 100 / 96 / 100 over several runs (simulated LCP 2.3 to 2.9 s, TBT 10 ms; with applied throttling LCP is 1.6 s), desktop 99 / 100 / 96 / 100. Best practices is 96 only because the Vercel Analytics script 404s on localhost. Total built JavaScript went from 1,892 KB to about 850 KB (uncompressed) with three.js gone.

**Draft copy to confirm** (written during the redesign; search `src/content/` for `TODO confirm`): the hero `intro`, `about.statement`, and each project's `headline` / `role` / `outcome`. `about.facts` (school, what you are looking for) is empty and hidden until filled in. The ASL project has no `role` or `outcome` yet. The hero reel is a placeholder cut from the two project demos: replace `public/videos/reel.mp4` and `reel-poster.webp` with a real showreel.

**Real content in place:** name, "Based in Burnaby, BC", email, portrait, resume PDF, GitHub and LinkedIn links, the FridgeMates project (hackathon winner; logo poster, GitHub, YouTube demo, Devpost, award badge; no clip, the demo exists only on YouTube, so its row shows a still: a short screen recording would help it most), the Virus Breach and ASL gesture detector projects (with demo clips), the Virus Breach GitHub and YouTube demo links, and the SFU Kendo - Mask Off video.

**Hidden until launch** (`hidden: true` in the content file; the sections skip these, but the data stays so it is easy to restore):

| Entry | File | Why hidden |
|---|---|---|
| Group Consensus App | `projects.ts` | placeholder description, poster and live link |
| Video Two, Video Three | `videos.ts` | placeholder titles, grey thumbnails, and a placeholder YouTube ID |

To show one: replace its placeholder content, then delete its `hidden: true` line.

**Visible entries with a link removed on purpose** (the button hides itself while the field is undefined; each has a `TODO` comment in `projects.ts`):

- Virus Breach: no `live` (it is a desktop game). It has `github` (`kennethsetiadharma/virus-breach`) and `demo` (YouTube video).
- ASL gesture detector: no `github` yet, so it shows `note: "Code available on request"` instead. When the repo URL is known, set `github` and delete the `note` line (and its `TODO`).

**Still to do:** the draft copy and placeholder reel above, the hidden entries and the ASL `github` link. After any change to the share image, re-scrape it with LinkedIn's Post Inspector, since previews are cached. Check `src/content/*.ts` for leftover placeholder text (search for `example.com`, `dQw4w9WgXcQ`, `TODO`).

## Stack

- Next.js 16 (App Router, TypeScript, `src/` dir, npm), React 19
- Tailwind CSS v4 (configured in `src/app/globals.css`, no `tailwind.config`)
- shadcn/ui (`base-nova` style, Base UI primitives; components are copied into `src/components/ui/`)
- Motion (`motion/react`) for UI animation
- @vercel/analytics (`<Analytics />` in `src/app/layout.tsx`; page views show in the Vercel dashboard, and it only reports on the deployed site)
- Geist / Geist Mono via `next/font/google` in `src/app/layout.tsx`

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build (also type-checks)
- `npm run lint`: ESLint

## Visual checks

Use the Playwright MCP server to screenshot the running site after any UI change. Check desktop (1440×900) and mobile (390×844), and read the browser console for errors. Also check once with reduced motion emulated: nothing should autoplay or pin, and all text must be fully visible. Sections fade in on scroll (`Reveal`), so scroll to a section before taking its screenshot.

## Structure

```
src/
  app/              routes: layout.tsx, page.tsx, globals.css, robots.ts, sitemap.ts; favicon.ico, icon.png, apple-icon.png, opengraph-image.png, twitter-image.png (generated)
  components/ui/    shadcn-style components (button, dialog)
  components/motion/ MotionProvider, Reveal, Stagger, ScrollWords (word-by-word scroll reveal, pinned)
  components/icons/ brand SVG icons: GitHub, LinkedIn, YouTube (lucide v1 has no brand icons)
  components/       shared leaves: Nav, Section, SocialLinks, HeroReel, ProjectRow, InViewClip, ProjectMeta, ThumbTrigger, VideoCard, VideoPlayer
  sections/         Hero, About, Projects, Videos, Footer (Server Components, map over content)
  content/          site.ts (name, intro, location, email, links, hero reel, about, section headings, nav), projects.ts, videos.ts
  lib/              utils.ts (cn), site-url.ts (absolute site URL for metadata, robots, sitemap)
public/videos/      hero reel + poster, code-project clips + posters, local video-project mp4s
public/images/      your portrait (path set in site.about.photo), video-project thumbnails (images/videos/), die-static.webp (source of the favicon and share images)
scripts/           make-icons.mjs (generates the favicon, app icons and link-preview images from the static die image)
```

## Content convention

- All project data lives in `src/content/projects.ts`, typed by `Project`.
- All video-editing projects live in `src/content/videos.ts`, typed by `VideoProject` (each has exactly one of `youtubeId` or `src`).
- Name, intro, location, email, links, the hero reel paths, the about statement/facts/photo, section headings (`sections`: a small eyebrow plus a large statement), contact line, and nav entries live in `src/content/site.ts`.
- Clips and posters go in `public/videos/` (referenced as `/videos/<file>`); photos and thumbnails go in `public/images/`.
- Adding a project must only require editing `projects.ts` and adding media. If a change would force a component edit to add a project, the component is wrong.
- Optional fields (`headline`, `role`, `outcome`, `github`, `live`, `demo`, `devpost`, `award`, `video`) hide their UI when undefined. `headline` is the big benefit line in the row (the title then sits above it as a small label; without it the title is the big line). `role` and `outcome` are short lines shown as "Role" and "Result". `demo` is a full YouTube URL shown as a "Demo" button with the YouTube icon, opening in a new tab. `devpost` is a Devpost page shown as a "Devpost" button. `award` is a short line (e.g. "SURGE Prize Track Winner · Fall Hacks 2026") shown as a `bg-brand` badge with a trophy above the title in the project row. `note` is a short muted line shown beside the link buttons (e.g. "Code available on request"); it renders on its own if there are no buttons.
- `hidden: true` on a project or video keeps it in the file but removes it from the page.
- YouTube IDs: only the 11-character ID after `v=` (stop before any `&`). Keep a leading `-` or `_`; dropping it makes the video fail to load.

## Design rules

- Feel: an Apple product page. One idea per screen, huge type, media as the hero, lots of space.
- Background: flat light grey (`body` in `globals.css`). Dark sections use `<Section tone="dark">` or the `.section-dark` class on a full-width wrapper: it swaps the colour tokens, so buttons, muted text and borders invert on their own. Dialogs are portaled to `body`, so they stay light.
- Type: Geist. Hero name `clamp(3rem, 9.5vw, 9rem)`; section statements and the footer contact line `clamp(2.5rem, 6vw, 5rem)`; all `tracking-tighter`, `leading-none`. Section headings are a small muted eyebrow ("Work") over the statement ("Things I've built.").
- Nav: floating dark glass pill, readable over light and dark.
- Buttons: dark, rounded (they turn light inside dark sections).
- Colour: neutral greys plus 1–2 vibrant accents max. The accent is `--brand` (`bg-brand`, `text-brand`). Don't confuse it with shadcn's `accent`, which is a subtle hover background. `--muted-foreground` is darker than the shadcn default on purpose (contrast on the grey page).
- The favicon and share images are still the chrome die (`public/images/die-static.webp`); it no longer appears on the page. `public/images/k-logo.svg` is kept but unused.
- Use the reference sites (butter.video, landonorris.com, apple.com product pages) for vibe only. Don't copy them.

## Animation

- Motion only (`motion/react`). No other animation libraries.
- Scroll-driven moments, in page order: the hero reel grows from a rounded frame to full-bleed and pins briefly; the About sentence pins and lights up word by word; project clips start as their row enters. Everything else is subtle: sections fade up on enter, `once: true`; the nav highlight slides between links.
- Scroll effects animate only `transform`, `opacity` and `clip-path`. The reel's scaling is plain CSS driven by one `--p` variable (`.reel-track` / `.reel-frame` in `globals.css`); `HeroReel` only sets `--p`.
- Respect `prefers-reduced-motion`: `MotionConfig reducedMotion="user"` at the root, CSS smooth scroll only under `no-preference`, no video autoplay, no pinning, no dimmed words. Do reduced-motion switches in CSS (`motion-reduce:` / `motion-safe:` or a media query), not by branching markup on `useReducedMotion()`: the server can't know the setting, so different markup causes a hydration error. Using the hook inside event handlers is fine.
- `ScrollWords` dims unlit words to 0.47 opacity (`DIM`), the lowest that passes large-text contrast. Lower looks stronger but fails the accessibility audit.

## Video and performance

- **Hero reel loading order (keep it):** the poster (`reel-poster.webp`) is the LCP element. It is a static file served with `unoptimized`, `loading="eager"` and `fetchPriority="high"`; through the image optimizer the simulated mobile LCP was 3.1 s instead of 2.3 s. The `<video>` mounts only in the poster's `onLoad`, so the 2.3 MB reel never competes with first paint. It pauses off-screen and has a pause button. Reduced motion or data saver (`navigator.connection.saveData`): the video never mounts, the poster stays.
- **Project clips** (`InViewClip`): the row shows the poster; the `<video>` mounts and downloads only when the row is 40% in view, plays muted on a loop, and pauses when it leaves. Reduced motion or data saver: a play button instead, which loads the clip with controls. Clips must be muted, short, compressed, and always have a poster.
- The video-project lightbox player (mp4) has controls and sound, since the viewer clicked play, and still gets a poster.
- YouTube iframes load only after a click, from `youtube-nocookie.com`. Never render an iframe on page load.
- Phones get the same page. From 768px up the reel frame pins at full screen height; below that it is a 16:9 frame that grows from 90% to full width without pinning.

## Media workflow

- **Project demo clips:** H.264 MP4, about 1280×720, roughly 1.5–2 Mbps, a few MB (aim for under about 8 MB), muted is fine. Make it **fast-start** (the `moov` index before `mdat`) so it can play before it fully downloads. Posters are JPEGs under about 0.5 MB, 16:9 for both project rows and video thumbnails (they crop to it).
- **Hero reel:** `public/videos/reel.mp4` (muted, 1280×720, about 1.5 Mbps, 10 to 15 s, a few MB) plus `reel-poster.webp`, its first frame (make it with `sharp`, which ships with Next: `sharp(src).webp({ quality: 72 })`). Keep the file names, or change `site.hero`.
- **No ffmpeg on this Mac, and the Swift toolchain is broken** (`SwiftBridging` module redefinition). `avconvert` works but its presets are too high-bitrate (a 21 s clip came out at 25 MB). What worked: re-encode in Chrome via the Playwright MCP (play the file onto a 1280×720 canvas, record with `MediaRecorder` as `video/mp4;codecs=avc1` at a chosen `videoBitsPerSecond`, then save it with `download.saveAs`). Several clips can be cut into one file by pausing the recorder between seeks; the result is a fragmented MP4 with `moov` already first. For a normal MP4, fast-start with a small Python script that moves `moov` and shifts the `stco`/`co64` offsets (lossless). Posters: grab a frame with a canvas, or `sips -s format jpeg -Z 1600` for PNGs.
- Don't commit raw source recordings or huge originals (GitHub rejects files over 100 MB). Big photos are fine to keep but resize if convenient (Next optimises them at request time).
- Keep file-name capitalisation identical everywhere (`.JPG` vs `.jpg`); some hosts are case-sensitive.
- **Stale image gotcha:** if you overwrite an image under the same filename, the dev server can keep serving the old resized copy from memory. Restart `npm run dev`, or use a new filename.

## Decisions and gotchas

- Video thumbnails are static; hover shows a zoom and a badge (always visible on touch, and always on the large feature), and a **click** opens the lightbox. Nothing opens on hover. Project media is not clickable: its clip plays in place.
- Dialogs (`ui/dialog.tsx`): the close X goes in the title row (`DialogCloseButton` with `overlayClose={false}`), never over the media, because players put controls in the top-right. The close button takes initial focus so Esc still works when an iframe is present.
- The hero headline is `clamp(3rem, 9.5vw, 9rem)` so the full name fits on one line on desktop, and the top of the reel shows above the fold at 1440×900 and 390×844. Re-check this if the name or intro changes.
- The Videos section makes the first visible video a large feature and puts the rest in a grid below, so it looks finished with one video or many.
- Nav highlight: an `IntersectionObserver` on the hero (`main > section`, which counts as Home) and each `site.nav` target, with the middle of the screen as the trigger line. Nothing crosses it in the footer, so the last section stays highlighted.
- Lighthouse is run with `npx` from a temp folder against `next start`; it is **not** a project dependency. The default (simulated) mobile LCP is noisy, 2.3 to 2.9 s run to run; `--throttling-method=devtools` gives the applied-throttling figure (1.6 s). Geist Mono has `preload: false` so it doesn't compete with Geist Sans.
- Favicon, app icon and link-preview (Open Graph + Twitter) images are all the static die image: `src/app/favicon.ico` (16/32/48), `icon.png`, `apple-icon.png` and `opengraph-image.png` / `twitter-image.png` (1200x630, the die on the site's grey gradient). They are generated, not hand-made: to change them, replace `public/images/die-static.webp` and run `node scripts/make-icons.mjs` (uses `sharp`, which ships with Next). Title, description and the Open Graph / Twitter tags come from `src/content/site.ts` via `metadata` in `layout.tsx`. The absolute site URL (share image, canonical link, robots.txt, sitemap) is `siteUrl` in `src/lib/site-url.ts`: it comes from `NEXT_PUBLIC_SITE_URL` or, on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` (which follows a custom domain automatically); locally it falls back to `http://localhost:3000`. After the first deploy, paste the live URL into LinkedIn's Post Inspector (and any other preview debugger) once, since those sites cache link previews.
- Playwright screenshots can time out while a video is playing; pause the videos first and pass a longer `timeout`. Navigating to the same URL with only a different `#hash` doesn't reload the page, so go through `about:blank` first.

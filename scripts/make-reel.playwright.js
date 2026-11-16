// Records the hero reel in Chrome. Run it with the Playwright MCP tool
// `browser_run_code_unsafe` and `filename: "scripts/make-reel.playwright.js"`
// while `npm run dev` is running. Full steps: CLAUDE.md, "Recutting the hero reel".
//
// It plays each segment onto a 1920x1080 canvas (cropped to fill), records the canvas
// with MediaRecorder as H.264 MP4, and saves public/_raw/reel.mp4 plus the first frame
// as public/_raw/reel-poster.png. Then run `node scripts/finish-reel.mjs`.
//
// To change the cut, edit SEGMENTS: [url served by the dev server, start second, length in seconds].
// Sources must be reachable by the dev server, so copy originals into public/_raw/ first.
async (page) => {
  const SEGMENTS = [
    ["/_raw/kendo.mp4", 0.15, 6.9], // SFU Kendo: opening b-roll (lineup, cloth, name tag)
    ["/_raw/vb.mov", 5, 3], // Virus Breach: gameplay
    ["/videos/aslgesturedemo.mp4", 10, 3], // ASL detector: no better original exists
  ];
  const BITRATE = 3_000_000; // the encoder lands under this; 3 Mbps gave about 2 Mbps
  // Relative to the project root (where the Playwright MCP server runs). `process` is not available here.
  const OUT = "public/_raw/";

  await page.goto("http://localhost:3000/robots.txt"); // any same-origin page
  const info = await page.evaluate(
    async ({ SEGMENTS, BITRATE }) => {
      const W = 1920, H = 1080;
      const load = (src) =>
        new Promise((res, rej) => {
          const v = document.createElement("video");
          v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = src;
          v.onloadeddata = () => res(v);
          v.onerror = () => rej(new Error("could not load " + src));
        });
      const videos = {};
      for (const [src] of SEGMENTS) videos[src] ??= await load(src);

      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      const draw = (v) => {
        const s = Math.max(W / v.videoWidth, H / v.videoHeight);
        const w = v.videoWidth * s, h = v.videoHeight * s;
        ctx.drawImage(v, (W - w) / 2, (H - h) / 2, w, h);
      };
      const seek = (v, t) => new Promise((r) => { v.onseeked = () => r(); v.currentTime = t; });

      const rec = new MediaRecorder(canvas.captureStream(30), {
        mimeType: "video/mp4;codecs=avc1",
        videoBitsPerSecond: BITRATE,
      });
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      let first = true;
      for (const [src, start, len] of SEGMENTS) {
        const v = videos[src];
        await seek(v, start);
        draw(v);
        // The recorder is paused during every seek, so cuts are clean.
        if (first) {
          first = false;
          window.__poster = await new Promise((r) => canvas.toBlob(r, "image/png"));
          rec.start();
        } else rec.resume();
        await v.play();
        await new Promise((res) => {
          const tick = () => {
            draw(v);
            if (v.currentTime >= start + len || v.ended) res();
            else v.requestVideoFrameCallback(tick);
          };
          v.requestVideoFrameCallback(tick);
        });
        v.pause();
        rec.pause();
      }
      const stopped = new Promise((r) => (rec.onstop = r));
      rec.resume(); rec.stop();
      await stopped;
      window.__reel = new Blob(chunks, { type: "video/mp4" });
      return { bytes: window.__reel.size, seconds: SEGMENTS.reduce((n, s) => n + s[2], 0) };
    },
    { SEGMENTS, BITRATE },
  );

  const save = async (key, file) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.evaluate((k) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(window[k]);
        a.download = k;
        document.body.appendChild(a);
        a.click();
      }, key),
    ]);
    await download.saveAs(OUT + file);
  };
  await save("__reel", "reel.mp4");
  await save("__poster", "reel-poster.png");
  return info;
}

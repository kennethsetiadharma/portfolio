"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Euler, Quaternion } from "three";
import { Die } from "./Die";
import { DieEnvironment } from "./DieEnvironment";
import { DIE } from "./die-config";

// Dev-only (see app/dev/die-snapshot). Renders the real die from the same code as the hero,
// at its rest pose (K-forward), on a transparent background, then crops and downsizes it into
// the static die image (public/images/die-static.webp).
//
// Alignment contract: the crop is the CENTRE square of side `frame` x the canvas height, and the
// die is drawn at DIE.fit.max with the same camera as the hero. HeroFallback relies on this
// to line the still up with the live 3D die. Change them together.

const REST = new Quaternion().setFromEuler(new Euler(...DIE.restRotation));
const CANVAS_CSS_PX = 1024; // canvas size on screen
const DPR = 3; // render density: the canvas is 3072 px, then downsized (supersampled, so edges are crisp)

declare global {
  interface Window {
    __dieSnapshotReady?: boolean;
  }
}

// Waits for the K to load and a few frames to draw before saying "ready".
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 8) onReady();
  });
  return null;
}

// Halve the size step by step (each step <= 2x) for a clean downscale.
function downscale(source: HTMLCanvasElement, target: number) {
  let current = source;
  while (current.width / 2 >= target) {
    const half = document.createElement("canvas");
    half.width = Math.round(current.width / 2);
    half.height = Math.round(current.height / 2);
    const ctx = half.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, half.width, half.height);
    current = half;
  }
  const out = document.createElement("canvas");
  out.width = out.height = target;
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(current, 0, 0, target, target);
  return out;
}

export function DieSnapshot() {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [report, setReport] = useState("");
  const { frame, size } = DIE.staticDie;

  const download = () => {
    const src = canvasEl.current;
    if (!src) return;
    // Centre square, `frame` x canvas height, copied out of the full-size render.
    const side = Math.round(frame * src.height);
    const crop = document.createElement("canvas");
    crop.width = crop.height = side;
    crop
      .getContext("2d")!
      .drawImage(
        src,
        (src.width - side) / 2,
        (src.height - side) / 2,
        side,
        side,
        0,
        0,
        side,
        side,
      );
    const out = downscale(crop, size);

    // Warn if the die touches the crop edge (it would be cut off).
    const { data } = out.getContext("2d")!.getImageData(0, 0, size, size);
    let touchesEdge = false;
    for (let i = 0; i < size && !touchesEdge; i++) {
      for (const [x, y] of [
        [i, 0],
        [i, size - 1],
        [0, i],
        [size - 1, i],
      ]) {
        if (data[(y * size + x) * 4 + 3] > 8) touchesEdge = true;
      }
    }

    out.toBlob(
      (blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "die-static.webp";
        a.click();
        setReport(
          `${size}x${size} webp, ${(blob.size / 1024).toFixed(0)} KB` +
            (touchesEdge
              ? " | WARNING: the die touches the crop edge. Raise staticDie.frame."
              : " | edges clear"),
        );
      },
      "image/webp",
      0.9,
    );
  };

  return (
    <main className="flex w-full flex-col items-center gap-4 px-6 py-24">
      <h1 className="text-2xl font-medium">Die snapshot (dev only)</h1>
      <p className="max-w-xl text-center text-sm text-muted-foreground">
        Renders the real die at its rest pose. Download, then save it as{" "}
        <code>public/images/die-static.webp</code>. Re-do this whenever the
        die&apos;s colours, K, pips, rest pose or lighting change.
      </p>
      {/* Fixed 1024px square (shrink-0, no border) so the canvas is exactly square. */}
      <div
        style={{ width: CANVAS_CSS_PX, height: CANVAS_CSS_PX }}
        className="shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/10"
      >
        <Canvas
          dpr={DPR}
          gl={{ alpha: true, preserveDrawingBuffer: true, antialias: true }}
          camera={{ position: [0, 0, DIE.camera.z], fov: DIE.camera.fov }}
          onCreated={({ gl }) => {
            canvasEl.current = gl.domElement;
          }}
        >
          <Suspense fallback={null}>
            <group scale={DIE.fit.max}>
              <group quaternion={REST}>
                <Die onRoll={() => {}} />
              </group>
            </group>
            <ReadySignal
              onReady={() => {
                setReady(true);
                window.__dieSnapshotReady = true;
              }}
            />
          </Suspense>
          <DieEnvironment />
        </Canvas>
      </div>
      <button
        type="button"
        onClick={download}
        disabled={!ready}
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
      >
        {ready ? "Download die-static.webp" : "Rendering…"}
      </button>
      <p className="text-sm text-muted-foreground">{report}</p>
    </main>
  );
}

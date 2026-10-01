"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { Euler, MathUtils, Quaternion, Vector3 } from "three";
import type { Group } from "three";
import { Die } from "./Die";
import { DIE } from "./die-config";

// Matches --brand in globals.css. Shows up as a coloured reflection in the chrome.
const ACCENT = "#a3f53b";

const REST = new Quaternion().setFromEuler(new Euler(...DIE.restRotation));
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

type Phase = "idle" | "roll" | "hold";

// Holds all die motion. State lives in refs and is updated in useFrame, so
// nothing re-renders React 60 times a second.
function DieRig({ progress }: { progress?: MotionValue<number> }) {
  // Size the die to the canvas so a tumbling corner (the die is ~3.5 units across
  // corner to corner, at scale 1) never clips on a narrow phone screen. `viewport`
  // is the canvas size in world units; 3.9 leaves roughly 10% of breathing room.
  const viewportWidth = useThree((state) => state.viewport.width);
  const fit = Math.min(1.4, viewportWidth / 3.9);
  const tilt = useRef<Group>(null); // outer: mouse tilt
  const body = useRef<Group>(null); // inner: the die's orientation
  const pointer = useRef({ x: 0, y: 0 });
  const s = useRef({
    q: REST.clone(), // tumble state (kept underneath while scroll-settling)
    q0: new Quaternion(), // where a roll started
    axis: new Vector3(0, 1, 0), // random roll axis
    phase: "idle" as Phase,
    t: 0, // seconds in the current roll / hold
    idle: 1, // 0..1 ramp so the tumble eases back in after a roll
  });

  // Track the cursor across the whole window, so the tilt works over the hero text too.
  // Touch has no cursor: a finger dragging to scroll must not tilt the die, so touch
  // input just re-centres it.
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        pointer.current.x = 0;
        pointer.current.y = 0;
        return;
      }
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const startRoll = () => {
    const st = s.current;
    if (body.current) st.q.copy(body.current.quaternion); // start from what's on screen
    st.q0.copy(st.q);
    st.axis
      .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    st.phase = "roll";
    st.t = 0;
  };

  const dq = useRef(new Quaternion());
  const spinQ = useRef(new Quaternion());
  const euler = useRef(new Euler());

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05); // ignore huge gaps (e.g. tab was hidden)
    const st = s.current;
    // 0 at the top of the page, 1 once scrolled well past the hero.
    const settle = MathUtils.smoothstep(progress?.get() ?? 0, 0, 0.6);

    if (st.phase === "idle") {
      st.idle = Math.min(1, st.idle + dt);
      const speed = st.idle * (1 - settle);
      const [wx, wy, wz] = DIE.idleSpin;
      euler.current.set(wx * dt * speed, wy * dt * speed, wz * dt * speed);
      dq.current.setFromEuler(euler.current);
      st.q.multiply(dq.current).normalize();
    } else if (st.phase === "roll") {
      st.t += dt;
      const k = Math.min(1, st.t / DIE.rollSeconds);
      const e = easeOutQuart(k);
      // Slide from the start orientation to K-forward, while spinning extra full
      // turns around a random axis. The spin angle shrinks to 0 as e reaches 1,
      // so the die lands exactly on REST.
      spinQ.current.setFromAxisAngle(
        st.axis,
        Math.PI * 2 * DIE.rollTurns * (1 - e),
      );
      st.q.copy(st.q0).slerp(REST, e).multiply(spinQ.current).normalize();
      if (k >= 1) {
        st.q.copy(REST);
        st.phase = "hold";
        st.t = 0;
      }
    } else {
      st.t += dt;
      if (st.t >= DIE.holdSeconds) {
        st.phase = "idle";
        st.idle = 0;
      }
    }

    if (body.current) {
      // Scrolling away blends whatever it's doing toward K-forward.
      body.current.quaternion.copy(st.q).slerp(REST, settle);
    }
    if (tilt.current) {
      const p = pointer.current;
      tilt.current.rotation.x = MathUtils.damp(
        tilt.current.rotation.x,
        p.y * 0.25 * (1 - settle),
        6,
        dt,
      );
      tilt.current.rotation.y = MathUtils.damp(
        tilt.current.rotation.y,
        p.x * 0.35 * (1 - settle),
        6,
        dt,
      );
    }
  });

  return (
    <group ref={tilt} scale={fit}>
      <group ref={body}>
        <Die onRoll={startRoll} />
      </group>
    </group>
  );
}

// Mounts only once the die has loaded (it sits inside the same <Suspense>), then
// waits for a few real frames so the canvas is never revealed before it has drawn.
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady();
  });
  return null;
}

const MIN_DPR = 1;
// Let the first seconds of shader compiling and texture upload settle before the
// performance monitor starts judging the frame rate.
const WARMUP_MS = 1500;

export default function HeroScene({
  progress,
  paused = false,
  dprMax = 2,
  onReady,
  onFail,
}: {
  progress?: MotionValue<number>;
  /** Stops the render loop (no drawing, no useFrame) while the hero is off-screen. */
  paused?: boolean;
  /** Highest pixel density to render at (1.5 on touch/small screens, 2 on desktop). */
  dprMax?: number;
  /** Called once the first frames are drawn, so the static die can fade out. */
  onReady?: () => void;
  /** Called if the device can't keep up, or the WebGL context is lost. */
  onFail?: () => void;
}) {
  // Quality: 1 = full pixel density, 0 = lowest (1x). Driven by PerformanceMonitor.
  const [quality, setQuality] = useState(1);
  const [ready, setReady] = useState(false);
  const [monitorOn, setMonitorOn] = useState(false);
  const floorDeclines = useRef(0);
  // The highest pixel density we allow right now: dprMax at full quality, 1 at the
  // lowest. Rounded to quarter steps so the canvas isn't resized for tiny changes.
  const dprCap = Math.round(MathUtils.lerp(MIN_DPR, dprMax, quality) * 4) / 4;

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setMonitorOn(true), WARMUP_MS);
    return () => window.clearTimeout(id);
  }, [ready]);
  return (
    // dpr [min, max]: the screen's own pixel density, clamped to that range. The max is
    // 1.5 on phones and 2 on desktop, and the performance monitor below lowers it if
    // the frame rate drops. (A plain number would force that density even on 1x screens.)
    <Canvas
      dpr={[MIN_DPR, dprCap]}
      frameloop={paused ? "never" : "always"}
      // pan-y: vertical swipes over the die scroll the page instead of being swallowed.
      style={{ touchAction: "pan-y" }}
      camera={{ position: [0, 0, 7], fov: 40 }}
      onCreated={({ gl }) => {
        // The OS can take the WebGL context away (e.g. low memory): show the static die.
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail?.();
        });
      }}
    >
      {/* The K is loaded from an SVG, which suspends until it arrives. */}
      <Suspense fallback={null}>
        <DieRig progress={progress} />
        <ReadySignal
          onReady={() => {
            setReady(true);
            onReady?.();
          }}
        />
      </Suspense>
      {/* Only judge FPS while the scene is actually rendering (a paused canvas would
          read as 0 fps). It remounts on resume, starting from the current quality. */}
      {monitorOn && !paused && (
        <PerformanceMonitor
          factor={quality}
          step={0.25}
          onIncline={() => {
            floorDeclines.current = 0;
          }}
          onDecline={(api) => {
            // Still declining after reaching the lowest quality = the device can't cope.
            if (api.factor <= 0 && ++floorDeclines.current >= 2) onFail?.();
          }}
          onChange={(api) => setQuality(api.factor)}
        />
      )}
      {/* Chrome is only as interesting as what it reflects. This builds a
          studio-style environment from glowing panels in code, so no HDR
          image is downloaded. The dark backdrop gives the chrome contrast;
          a light one makes it look like flat grey plastic. */}
      <Environment resolution={256}>
        <color attach="background" args={["#333333"]} />
        <Lightformer
          form="rect"
          intensity={5}
          position={[0, 5, -2]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[0, 0, 6]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[-5, 1, 1]}
          rotation-y={Math.PI / 2}
          scale={[10, 1, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[10, 1, 1]}
        />
        {/* Aimed so the K face, at its resting tilt, reflects a bright panel
            (otherwise it mirrors the dark backdrop and looks black). */}
        <Lightformer
          form="rect"
          intensity={3}
          position={[-3.3, -2.2, 4.6]}
          scale={[5, 4, 1]}
        />
        <Lightformer
          form="rect"
          color={ACCENT}
          intensity={8}
          position={[0, -5, 2]}
          rotation-x={Math.PI / 2}
          scale={[10, 3, 1]}
        />
      </Environment>
    </Canvas>
  );
}

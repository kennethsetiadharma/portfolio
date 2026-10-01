"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
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
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
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
    <group ref={tilt} scale={1.4}>
      <group ref={body}>
        <Die onRoll={startRoll} />
      </group>
    </group>
  );
}

export default function HeroScene({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  return (
    // dpr caps pixel density at 2x so high-DPI screens don't render 9x the pixels.
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 40 }}>
      {/* The K is loaded from an SVG, which suspends until it arrives. */}
      <Suspense fallback={null}>
        <DieRig progress={progress} />
      </Suspense>
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

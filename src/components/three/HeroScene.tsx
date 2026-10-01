"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Mesh } from "three";

// Matches --brand in globals.css. Shows up as a coloured reflection in the chrome.
const ACCENT = "#a3f53b";

function ChromeKnot() {
  const ref = useRef<Mesh>(null);

  // Runs every frame. `delta` = seconds since last frame, so speed is the
  // same on a 60Hz and a 144Hz screen.
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.4;
    ref.current.rotation.x += delta * 0.15;
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.35, 256, 48]} />
      {/* metalness 1 + low roughness = mirror-like chrome */}
      <meshStandardMaterial color="white" metalness={1} roughness={0.12} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    // dpr caps pixel density at 2x so high-DPI screens don't render 9x the pixels.
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 40 }}>
      <ChromeKnot />
      {/* Chrome is only as interesting as what it reflects. This builds a
          studio-style environment from glowing panels in code, so no HDR
          image is downloaded. The dark backdrop gives the chrome contrast;
          a light one makes it look like flat grey plastic. */}
      <Environment resolution={256}>
        <color attach="background" args={["#333333"]} />
        <Lightformer form="rect" intensity={5} position={[0, 5, -2]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[0, 0, 6]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={3} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[10, 1, 1]} />
        <Lightformer form="rect" intensity={3} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[10, 1, 1]} />
        <Lightformer form="rect" color={ACCENT} intensity={8} position={[0, -5, 2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      </Environment>
    </Canvas>
  );
}

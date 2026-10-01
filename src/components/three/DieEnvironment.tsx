"use client";

import { Environment, Lightformer } from "@react-three/drei";

// Matches --brand in globals.css. Shows up as a coloured reflection in the chrome.
const ACCENT = "#a3f53b";

// The die's lighting. Shared by the live hero (HeroScene) and the dev-only snapshot page
// (DieSnapshot), so the static die image can never drift from what the 3D die looks like.
// Chrome is only as interesting as what it reflects. This builds a studio-style environment
// from glowing panels in code, so no HDR image is downloaded. The dark backdrop gives the
// chrome contrast; a light one makes it look like flat grey plastic.
export function DieEnvironment() {
  return (
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
  );
}

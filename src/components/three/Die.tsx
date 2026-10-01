"use client";

import { useMemo, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { Instance, Instances, RoundedBox, useCursor } from "@react-three/drei";
import {
  BackSide,
  ExtrudeGeometry,
  Path,
  Quaternion,
  Shape,
  Vector3,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { DIE } from "./die-config";

const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

// Each face: its value and the direction it points. Opposite faces sum to 7,
// and the 1 (the K) points at +Z, which is toward the camera.
const FACES: { value: number; normal: Vector3 }[] = [
  { value: 1, normal: new Vector3(0, 0, 1) },
  { value: 6, normal: new Vector3(0, 0, -1) },
  { value: 2, normal: new Vector3(0, 1, 0) },
  { value: 5, normal: new Vector3(0, -1, 0) },
  { value: 3, normal: new Vector3(1, 0, 0) },
  { value: 4, normal: new Vector3(-1, 0, 0) },
];

// Pip positions on a face, in the face's own 2D coordinates.
const d = DIE.pipSpacing;
const TL: [number, number] = [-d, d];
const TR: [number, number] = [d, d];
const BL: [number, number] = [-d, -d];
const BR: [number, number] = [d, -d];
const C: [number, number] = [0, 0];
const ML: [number, number] = [-d, 0];
const MR: [number, number] = [d, 0];
const PIPS: Record<number, [number, number][]> = {
  1: [], // the K goes here instead
  2: [TL, BR],
  3: [TL, C, BR],
  4: [TL, TR, BL, BR],
  5: [TL, TR, C, BL, BR],
  6: [TL, TR, ML, MR, BL, BR],
};

// The coloured plate is a thin inlay sitting on each face of the body.
const PLATE_SIZE = 1.5;
const PLATE_RADIUS = 0.2;
const PLATE_DEPTH = 0.06;
const PLATE_BEVEL = 0.01;
const PLATE_BASE = 0.99; // slightly inside the body so there's no gap
const PLATE_TOP = PLATE_BASE + PLATE_DEPTH + PLATE_BEVEL;

function makePlate(pips: [number, number][]) {
  const h = PLATE_SIZE / 2;
  const r = PLATE_RADIUS;
  const shape = new Shape();
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.absarc(h - r, -h + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(h, h - r);
  shape.absarc(h - r, h - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-h + r, h);
  shape.absarc(-h + r, h - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-h, -h + r);
  shape.absarc(-h + r, -h + r, r, Math.PI, Math.PI * 1.5, false);
  // A round hole per pip, so the pip bowl can sit sunk into the plate.
  for (const [x, y] of pips) {
    const hole = new Path();
    hole.absarc(x, y, DIE.pipRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  return new ExtrudeGeometry(shape, {
    depth: PLATE_DEPTH,
    bevelEnabled: true,
    bevelThickness: PLATE_BEVEL,
    bevelSize: PLATE_BEVEL,
    bevelSegments: 2,
    curveSegments: 24,
  });
}

// The K: SVG path -> shapes -> extruded chrome letter, centred and sized.
function KMark() {
  const svg = useLoader(SVGLoader, DIE.kSvg);
  const { geometry, scale, halfDepth } = useMemo(() => {
    const shapes = svg.paths.flatMap((path) => path.toShapes());
    // Sizes are in SVG units (the placeholder is 100x120), scaled down below.
    const geo = new ExtrudeGeometry(shapes, {
      depth: 16,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 2,
      bevelSegments: 4,
      curveSegments: 12,
    });
    geo.center();
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const s = DIE.kHeight / (box.max.y - box.min.y);
    return {
      geometry: geo,
      scale: s,
      halfDepth: ((box.max.z - box.min.z) / 2) * s,
    };
  }, [svg]);

  return (
    // SVG y points down, so flip y to stand the letter upright.
    <mesh
      geometry={geometry}
      scale={[scale, -scale, scale]}
      position={[0, 0, PLATE_TOP + halfDepth - 0.01]}
    >
      <meshStandardMaterial color={DIE.silver} metalness={1} roughness={0.08} />
    </mesh>
  );
}

export function Die({ onRoll }: { onRoll: () => void }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const faces = useMemo(
    () =>
      FACES.map(({ value, normal }) => {
        const quaternion = new Quaternion().setFromUnitVectors(Z_AXIS, normal);
        const u = X_AXIS.clone().applyQuaternion(quaternion);
        const v = Y_AXIS.clone().applyQuaternion(quaternion);
        // Pip bowls: dome points into the die (-normal), rim sits on the plate surface.
        const bowlQuat = new Quaternion().setFromUnitVectors(
          Y_AXIS,
          normal.clone().negate(),
        );
        const pips = PIPS[value].map(([x, y]) => ({
          position: normal
            .clone()
            .multiplyScalar(PLATE_TOP)
            .addScaledVector(u, x)
            .addScaledVector(v, y)
            .toArray() as [number, number, number],
        }));
        return {
          value,
          quaternion,
          bowlQuat,
          pips,
          plate: makePlate(PIPS[value]),
        };
      }),
    [],
  );

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onRoll();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[2, 2, 2]} radius={DIE.bodyRadius} smoothness={6}>
        <meshStandardMaterial
          color={DIE.silver}
          metalness={1}
          roughness={0.1}
        />
      </RoundedBox>

      {faces.map(({ value, quaternion, plate }) => (
        <group key={value} quaternion={quaternion}>
          <mesh geometry={plate} position={[0, 0, PLATE_BASE]}>
            <meshStandardMaterial
              color={DIE.faceColors[value]}
              metalness={1}
              roughness={0.2}
              envMapIntensity={0.55}
            />
          </mesh>
          {value === 1 && <KMark />}
        </group>
      ))}

      {/* All 20 pips share one geometry and one draw call. The bowl is a
          flattened hemisphere drawn inside-out, so you look into a dimple. */}
      <Instances limit={20}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={DIE.silver}
          metalness={1}
          roughness={0.05}
          side={BackSide}
        />
        {faces.flatMap(({ value, bowlQuat, pips }) =>
          pips.map((pip, i) => (
            <Instance
              key={`${value}-${i}`}
              position={pip.position}
              quaternion={bowlQuat}
              scale={[DIE.pipRadius, DIE.pipDepth, DIE.pipRadius]}
            />
          )),
        )}
      </Instances>
    </group>
  );
}

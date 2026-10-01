// Everything you might want to tweak on the hero die lives here.

export const DIE = {
  /** Tinted-chrome colour per face value (1 is the K face). Opposite faces sum to 7. */
  faceColors: {
    1: "#a9a9a9", // silver
    2: "#a3f53b", // electric green
    3: "#ff2fb3", // magenta
    4: "#2f5bff", // cobalt blue
    5: "#ff8a1f", // orange
    6: "#8a4dff", // violet
  } as Record<number, string>,

  /** Path of the K shape for the 3D die (extruded chrome). Swap public/k.svg to change that letter. */
  kSvg: "/k.svg",
  /**
   * The static die image (first paint, reduced motion, no WebGL, slow devices): a render of
   * the real die at its rest pose. Regenerate it at /dev/die-snapshot (npm run dev) whenever
   * the die's colours, K, pips, rest pose or lighting change.
   * `frame` = the image's side as a fraction of the canvas height at the snapshot scale;
   * HeroFallback uses it to size the image so it lines up with the live 3D die.
   */
  staticDie: { src: "/images/die-static.webp", size: 900, frame: 0.9 },

  /** Camera for the hero canvas and the snapshot page (they must match). */
  camera: { z: 7, fov: 40 },
  /** The die's on-screen size: scale = min(max, canvasWidthInWorldUnits / widthUnits). */
  fit: { max: 1.4, widthUnits: 3.9 },
  /** Height of the K in die units (a die is 2 wide). */
  kHeight: 0.62,

  /** Rounded body: edge radius of the 2×2×2 cube. */
  bodyRadius: 0.22,
  /** Pip layout. */
  pipRadius: 0.17,
  pipSpacing: 0.42,
  pipDepth: 0.06,

  /** Shared look for pips and the K. */
  silver: "#f4f4f4",

  /** Orientation that shows the K to the camera. [0,0,0] = dead-on; a small tilt shows a side face or two. */
  restRotation: [0.2, -0.3, 0] as [number, number, number],

  /** Idle tumble speed in radians per second around x, y, z (slightly different on purpose). */
  idleSpin: [0.23, 0.31, 0.17] as [number, number, number],
  /** Roll: duration in seconds and extra full turns before landing K-forward. */
  rollSeconds: 1.2,
  rollTurns: 2,
  /** Pause on the K after a roll before the idle tumble resumes. */
  holdSeconds: 0.6,
};

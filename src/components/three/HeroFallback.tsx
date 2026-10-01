// Static stand-in for the 3D object: shown on mobile, with reduced motion,
// during server render, and while the 3D chunk downloads. CSS only, no image.
export function HeroFallback() {
  return (
    <div className="flex size-full items-center justify-center" aria-hidden>
      <div className="aspect-square h-3/5 rounded-full bg-[radial-gradient(circle_at_35%_30%,white_0%,oklch(0.8_0_0)_25%,oklch(0.35_0_0)_60%,oklch(0.75_0_0)_85%,white_100%)] shadow-2xl" />
    </div>
  );
}

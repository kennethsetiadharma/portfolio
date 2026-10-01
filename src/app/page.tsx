import { HeroCanvas } from "@/components/three/HeroCanvas";
import { site } from "@/content/site";

// Temporary test page: proves the 3D pipeline works. Real sections come later.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <HeroCanvas className="h-[45vh] w-full max-w-xl" />
      <h1 className="text-center text-[clamp(3rem,12vw,10rem)] font-medium leading-none tracking-tighter">
        {site.name}
      </h1>
    </main>
  );
}

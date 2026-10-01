import { notFound } from "next/navigation";
import { DieSnapshot } from "@/components/three/DieSnapshot";

export const metadata = {
  title: "Die snapshot (dev)",
  robots: { index: false },
};

// Dev-only tool: renders the hero die and exports the static die image.
// It 404s in production builds.
export default function DieSnapshotPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <DieSnapshot />;
}

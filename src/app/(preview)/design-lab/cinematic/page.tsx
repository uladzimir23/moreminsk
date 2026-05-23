import type { Metadata } from "next";
import { CinematicHero } from "../_components/cinematic-hero";
import { LandingShell } from "../_components/landing-shell";

export const metadata: Metadata = {
  title: "Design lab — Cinematic landing",
  robots: { index: false, follow: false },
};

export default function CinematicLandingPage() {
  return <LandingShell hero={<CinematicHero pinned />} overlapHero />;
}

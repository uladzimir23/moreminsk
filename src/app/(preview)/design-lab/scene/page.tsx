import type { Metadata } from "next";
import { LandingShell } from "../_components/landing-shell";
import { SceneHero } from "../_components/scene-hero";

export const metadata: Metadata = {
  title: "Design lab — Scene landing",
  robots: { index: false, follow: false },
};

export default function SceneLandingPage() {
  return <LandingShell hero={<SceneHero />} />;
}

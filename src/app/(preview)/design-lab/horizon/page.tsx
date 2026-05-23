import type { Metadata } from "next";
import { HorizonHero } from "../_components/horizon-hero";
import { LandingShell } from "../_components/landing-shell";

export const metadata: Metadata = {
  title: "Design lab — Horizon landing",
  robots: { index: false, follow: false },
};

export default function HorizonLandingPage() {
  return <LandingShell hero={<HorizonHero />} />;
}

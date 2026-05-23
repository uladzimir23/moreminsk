import type { Metadata } from "next";
import { SubmergedOptics } from "../_components/submerged-optics";

export const metadata: Metadata = {
  title: "Design lab — Submerged Optics",
  robots: { index: false, follow: false },
};

export default function OpticsLabPage() {
  return <SubmergedOptics standalone />;
}

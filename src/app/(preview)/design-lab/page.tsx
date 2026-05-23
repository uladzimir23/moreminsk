import type { Metadata } from "next";
import Link from "next/link";
import { CinematicHero } from "./_components/cinematic-hero";
import { HorizonHero } from "./_components/horizon-hero";
import { SceneHero } from "./_components/scene-hero";
import styles from "./page.module.scss";

// Design-lab index — three hero variants stacked. Each variant is wrapped
// in a Link to its own landing route where we'll build out fleet, photos,
// catalog and contact sections below the hero. The top-right header is
// pointer-events:none on the wrapper but the explicit «Open →» chip is
// reachable and explicitly hints the click affordance.

export const metadata: Metadata = {
  title: "Design lab — hero variants",
  robots: { index: false, follow: false },
};

type VariantMeta = {
  slug: string;
  label: string;
  Hero: () => React.ReactElement;
};

const VARIANTS: ReadonlyArray<VariantMeta> = [
  { slug: "horizon", label: "Horizon · editorial", Hero: HorizonHero },
  { slug: "scene", label: "Scene · day/night", Hero: SceneHero },
  { slug: "cinematic", label: "Cinematic · video", Hero: CinematicHero },
];

export default function DesignLabPage() {
  return (
    <div className={styles.shell}>
      {VARIANTS.map(({ slug, label, Hero }) => (
        <Link
          key={slug}
          href={`/design-lab/${slug}/`}
          className={styles.variant}
          aria-label={`Открыть лендинг: ${label}`}
        >
          <div className={styles.header} aria-hidden="true">
            <span className={styles.label}>{label}</span>
            <span className={styles.openLanding}>Open landing →</span>
          </div>
          <Hero />
        </Link>
      ))}
    </div>
  );
}

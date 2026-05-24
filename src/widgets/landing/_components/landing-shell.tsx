import Link from "next/link";
import type { ReactNode } from "react";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import styles from "./landing-shell.module.scss";
import { BookingCTASection } from "./sections/booking-cta-section";
import { ContactsSection } from "./sections/contacts-section";
import { FaqSection } from "./sections/faq-section";
import { FleetShowcaseSection } from "./sections/fleet-showcase-section";
import { GallerySection } from "./sections/gallery-section";
import { ReviewsStoriesSection } from "./sections/reviews-stories-section";
import { ServicesSection } from "./sections/services-section";

type LandingShellProps = {
  hero: ReactNode;
  // When the hero is a pinned/200vh scroll hero (cinematic), the content
  // block is pulled up 100vh with a higher z-index so it rises OVER the
  // sticky hero as the hero dissolves. Plain heroes leave this off.
  overlapHero?: boolean;
};

// Standard landing composition for design-lab variants: hero (per variant)
// + 5 real content sections. Photos are scraped from moreminsk.by (see
// _data/scraped-photos.json), yacht and service data comes from production
// src/shared/content/*.ts.
export function LandingShell({ hero, overlapHero = false }: LandingShellProps) {
  return (
    <div className={styles.shell} id="top">
      <LandingHeader />

      <Link href="/design-lab/" className={styles.backBar}>
        ← Все варианты
      </Link>

      {hero}

      <div className={overlapHero ? styles.overlap : undefined}>
        <FleetShowcaseSection />
        <ServicesSection />
        <GallerySection />
        <ReviewsStoriesSection />
        <FaqSection />
        <BookingCTASection />
        <ContactsSection />
        <LandingFooter />
      </div>
    </div>
  );
}

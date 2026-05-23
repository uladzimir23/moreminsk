import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./landing-shell.module.scss";
import { BookingCTASection } from "./sections/booking-cta-section";
import { ContactsSection } from "./sections/contacts-section";
import { FleetShowcaseSection } from "./sections/fleet-showcase-section";
import { GallerySection } from "./sections/gallery-section";
import { ServicesSection } from "./sections/services-section";

type LandingShellProps = {
  hero: ReactNode;
};

// Standard landing composition for design-lab variants: hero (per variant)
// + 5 real content sections. Photos are scraped from moreminsk.by (see
// _data/scraped-photos.json), yacht and service data comes from production
// src/shared/content/*.ts.
export function LandingShell({ hero }: LandingShellProps) {
  return (
    <div className={styles.shell}>
      <Link href="/design-lab/" className={styles.backBar}>
        ← Все варианты
      </Link>

      {hero}

      <FleetShowcaseSection />
      <ServicesSection />
      <GallerySection />
      <BookingCTASection />
      <ContactsSection />
    </div>
  );
}

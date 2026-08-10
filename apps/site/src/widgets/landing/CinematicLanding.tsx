import { CinematicHero } from "./_components/cinematic-hero";
import shell from "./_components/landing-shell.module.scss";
import { BookingCTASection } from "./_components/sections/booking-cta-section";
import { CertificateSection } from "./_components/sections/certificate-section";
import { ContactsSection } from "./_components/sections/contacts-section";
import { FaqSection } from "./_components/sections/faq-section";
import { FleetShowcaseSection } from "./_components/sections/fleet-showcase-section";
import { GallerySection } from "./_components/sections/gallery-section";
import { ReviewsStoriesSection } from "./_components/sections/reviews-stories-section";
import { ServicesSection } from "./_components/sections/services-section";
import { WaterBackdrop } from "./_components/water-backdrop";

// Production landing. Header/footer come from the [locale] layout; this composes
// a static video hero + the content stack. The water backdrop lives inside the
// content stack — it scrolls with sections and shows only through the ones with
// transparent backgrounds (Fleet, Reviews, FAQ, BookingCTA, Contacts).
export function CinematicLanding() {
  return (
    <div className={shell.shell} id="top">
      <CinematicHero />
      <div className={shell.overlap}>
        <div className={shell.waterBg} aria-hidden="true">
          <WaterBackdrop filterId="globalWater" variant="waves" />
        </div>
        <FleetShowcaseSection />
        <ServicesSection />
        <GallerySection />
        <CertificateSection />
        <ReviewsStoriesSection />
        <FaqSection />
        <BookingCTASection />
        <ContactsSection />
      </div>
    </div>
  );
}

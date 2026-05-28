import { StickyCtaProvider } from "@/shared/ui/sticky-cta/StickyCtaContext";
import { CinematicHero } from "./_components/cinematic-hero";
import shell from "./_components/landing-shell.module.scss";
import { BookingCTASection } from "./_components/sections/booking-cta-section";
import { ContactsSection } from "./_components/sections/contacts-section";
import { FaqSection } from "./_components/sections/faq-section";
import { FleetShowcaseSection } from "./_components/sections/fleet-showcase-section";
import { GallerySection } from "./_components/sections/gallery-section";
import { IncludedSection } from "./_components/sections/included-section";
import { ReviewsStoriesSection } from "./_components/sections/reviews-stories-section";
import { ServicesSection } from "./_components/sections/services-section";

// Production landing — the design-lab «cinematic» variant promoted as the
// home page. Header/footer come from the [locale] layout; this composes the
// pinned video hero + the content stack. The content block is pulled up over
// the pinned hero (see CinematicHero pinned + .overlap).
export function CinematicLanding() {
  return (
    <div className={shell.shell} id="top">
      <CinematicHero pinned />
      <StickyCtaProvider>
        <div className={shell.overlap}>
          <FleetShowcaseSection />
          <ServicesSection />
          <GallerySection />
          <ReviewsStoriesSection />
          <FaqSection />
          <IncludedSection />
          <BookingCTASection />
          <ContactsSection />
        </div>
      </StickyCtaProvider>
    </div>
  );
}

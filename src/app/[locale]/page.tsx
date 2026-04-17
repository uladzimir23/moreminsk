import { type Locale } from "@/i18n/routing";
import { CtaFinale } from "@/widgets/cta-finale/CtaFinale";
import { Faq } from "@/widgets/faq/Faq";
import { FleetGrid } from "@/widgets/fleet-grid/FleetGrid";
import { Hero } from "@/widgets/hero/Hero";
import { HowItWorks } from "@/widgets/how-it-works/HowItWorks";
import { Reviews } from "@/widgets/reviews/Reviews";
import { Services } from "@/widgets/services/Services";
import { WhyUs } from "@/widgets/why-us/WhyUs";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <Hero />
      <WhyUs />
      <FleetGrid />
      <Services />
      <HowItWorks />
      <Reviews />
      <Faq />
      <CtaFinale />
    </main>
  );
}

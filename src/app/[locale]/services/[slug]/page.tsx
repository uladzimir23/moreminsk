import { routing, type Locale } from "@/i18n/routing";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { ServiceDetail } from "@/widgets/service-detail/ServiceDetail";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.h1} — Море Minsk`,
    description: service.utp,
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const suitableYachts = YACHTS.filter((y) => service.suitableYachts.includes(y.slug));

  return (
    <main>
      <ServiceDetail service={service} yachts={suitableYachts} />
    </main>
  );
}

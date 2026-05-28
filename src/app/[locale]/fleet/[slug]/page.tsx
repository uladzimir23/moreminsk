import { routing, type Locale } from "@/i18n/routing";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { breadcrumbSchema, productSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { PHOTOS_BY_YACHT, type YachtSlug } from "@/widgets/landing/_data/photos";
import { YachtDetail } from "@/widgets/yacht-detail/YachtDetail";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => YACHTS.map((y) => ({ locale, slug: y.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const yacht = YACHTS.find((y) => y.slug === slug);
  if (!yacht) return {};
  return buildMetadata({
    locale,
    path: `/fleet/${slug}`,
    title: `Яхта ${yacht.name} — аренда на Минском море от ${yacht.pricePerHour} BYN/час`,
    description: `${yacht.description} Аренда в Минске: до ${yacht.capacity} гостей, капитан и топливо в цене, от ${yacht.pricePerHour} BYN/час.`,
  });
}

export default async function YachtSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const yacht = YACHTS.find((y) => y.slug === slug);
  if (!yacht) notFound();

  const photos = PHOTOS_BY_YACHT[slug as YachtSlug] ?? [];
  const services = SERVICES.filter((s) => s.suitableYachts.includes(yacht.slug));
  const others = YACHTS.filter((y) => y.slug !== slug).map((y) => ({
    slug: y.slug,
    name: y.name,
    type: y.type,
    pricePerHour: y.pricePerHour,
    badge: y.badge,
    cover: (PHOTOS_BY_YACHT[y.slug as YachtSlug] ?? [])[0] ?? "",
  }));

  return (
    <main>
      <JsonLd
        data={[
          productSchema(yacht, locale),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Флот", path: "/fleet" },
              { name: yacht.name, path: `/fleet/${slug}` },
            ],
            locale,
          ),
        ]}
      />
      <YachtDetail yacht={yacht} photos={photos} services={services} others={others} />
    </main>
  );
}

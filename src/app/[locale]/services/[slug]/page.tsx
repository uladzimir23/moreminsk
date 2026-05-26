import { routing, type Locale } from "@/i18n/routing";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { breadcrumbSchema, serviceSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
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
  const { locale, slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.h1,
    description: `${service.utp}. Цена от ${service.fromPrice} BYN, капитан и топливо в цене. Свободные даты и бронирование онлайн.`,
  });
}

export default async function ServiceSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const suitableYachts = YACHTS.filter((y) => service.suitableYachts.includes(y.slug));

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(service, locale),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Услуги", path: "/services" },
              { name: service.shortTitle, path: `/services/${slug}` },
            ],
            locale,
          ),
        ]}
      />
      <ServiceDetail service={service} yachts={suitableYachts} />
    </main>
  );
}

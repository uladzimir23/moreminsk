import { type Locale } from "@/i18n/routing";
import { breadcrumbSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { FleetCatalog } from "@/widgets/fleet-catalog/FleetCatalog";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/fleet",
    title: "Флот — 4 яхты на Минском море",
    description:
      "Парусные EVA, ALFA, BRAVO и моторная MARIO на 2–10 гостей. Капитан и топливо в цене, от 150 BYN/час. Фото, характеристики и цены каждой яхты.",
  });
}

export default async function FleetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Главная", path: "/" },
            { name: "Флот", path: "/fleet" },
          ],
          locale,
        )}
      />
      <FleetCatalog />
    </main>
  );
}

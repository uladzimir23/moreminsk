import { type Locale } from "@/i18n/routing";
import { breadcrumbSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { ServicesIndex } from "@/widgets/services-index/ServicesIndex";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/services",
    title: "Услуги — аренда яхты под событие в Минске",
    description:
      "Свадьба, день рождения, корпоратив, свидание, девичник, фотосессия, прогулки и мастер-класс на яхте на Минском море. Цены от 100 BYN.",
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Главная", path: "/" },
            { name: "Услуги", path: "/services" },
          ],
          locale,
        )}
      />
      <ServicesIndex />
    </main>
  );
}

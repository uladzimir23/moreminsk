import { type Locale, routing } from "@/i18n/routing";
import { breadcrumbSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { PricesPage } from "@/widgets/prices-page/PricesPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/ceny",
    title: "Цены на аренду яхт в Минске — от 150 BYN/час",
    description:
      "Почасовые цены на яхты EVA, ALFA, MARIO, BRAVO — от 150 BYN/час, минимум 1 час. Капитан и топливо в стоимости, без скрытых комиссий. Точную цену подтверждаем при звонке.",
  });
}

export default async function CenyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Главная", path: "/" },
            { name: "Цены", path: "/ceny" },
          ],
          locale,
        )}
      />
      <PricesPage />
    </main>
  );
}

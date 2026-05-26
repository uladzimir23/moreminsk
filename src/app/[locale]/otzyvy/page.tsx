import { type Locale, routing } from "@/i18n/routing";
import { breadcrumbSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { ReviewsPage } from "@/widgets/reviews-page/ReviewsPage";
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
    path: "/otzyvy",
    title: "Отзывы о прогулках на яхте в Минске",
    description:
      "Отзывы гостей о выходах на яхтах EVA, ALFA, MARIO, BRAVO — свидания, дни рождения, корпоративы и фотосессии на Минском море.",
  });
}

export default async function OtzyvyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: "Главная", path: "/" },
            { name: "Отзывы", path: "/otzyvy" },
          ],
          locale,
        )}
      />
      <ReviewsPage />
    </main>
  );
}

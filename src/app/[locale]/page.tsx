import { routing, type Locale } from "@/i18n/routing";
import { localBusinessSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { CinematicLanding } from "@/widgets/landing/CinematicLanding";
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
    path: "/",
    title: "Аренда яхт на Минском море — от 150 BYN/час",
    description:
      "Парусные и моторные яхты в аренду в Минске: свидания, дни рождения, корпоративы, фотосессии. 4 яхты, капитан и топливо в цене. Свободные даты — онлайн.",
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <CinematicLanding />
    </>
  );
}

import { type Locale } from "@/i18n/routing";
import { FleetCatalog } from "@/widgets/fleet-catalog/FleetCatalog";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Флот яхт — Море Minsk",
  description:
    "Весь флот Море Minsk: три парусные (EVA, ALFA, BRAVO) и одна моторная (MARIO) яхта на 2–10 гостей. Цены от 150 BYN/час.",
};

export default async function FleetPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <FleetCatalog />
    </main>
  );
}

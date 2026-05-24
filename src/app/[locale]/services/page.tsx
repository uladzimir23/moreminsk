import { type Locale } from "@/i18n/routing";
import { ServicesIndex } from "@/widgets/services-index/ServicesIndex";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Услуги — аренда яхт Минское море",
  description:
    "День рождения, корпоратив, свидание, девичник, фотосессия на яхте на Минском море. Цены от 150 BYN.",
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <ServicesIndex />
    </main>
  );
}

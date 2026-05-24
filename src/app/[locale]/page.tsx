import { routing, type Locale } from "@/i18n/routing";
import { CinematicLanding } from "@/widgets/landing/CinematicLanding";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <CinematicLanding />;
}

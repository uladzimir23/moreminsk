import { type Locale, routing } from "@/i18n/routing";
import { LandingFooter } from "@/widgets/landing/_components/landing-footer";
import { LandingHeader } from "@/widgets/landing/_components/landing-header";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "../providers/Providers";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const typedLocale = locale as Locale;
  setRequestLocale(typedLocale);

  return (
    <NextIntlClientProvider locale={typedLocale}>
      <Providers>
        <LandingHeader />
        {children}
        <LandingFooter />
      </Providers>
    </NextIntlClientProvider>
  );
}

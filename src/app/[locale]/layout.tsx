import { type Locale, routing } from "@/i18n/routing";
import { AppPanel } from "@/widgets/app-panel/AppPanel";
import { Appbar } from "@/widgets/appbar/Appbar";
import { BottomNav } from "@/widgets/bottom-nav/BottomNav";
import { Footer } from "@/widgets/footer/Footer";
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
        <Appbar />
        {children}
        <Footer />
        <BottomNav />
        <AppPanel />
      </Providers>
    </NextIntlClientProvider>
  );
}

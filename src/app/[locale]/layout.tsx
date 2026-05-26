import { type Locale, routing } from "@/i18n/routing";
import { organizationSchema, websiteSchema } from "@/shared/lib/schema";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { LandingFooter } from "@/widgets/landing/_components/landing-footer";
import { LandingHeader } from "@/widgets/landing/_components/landing-header";
import shell from "@/widgets/landing/_components/landing-shell.module.scss";
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
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Providers>
        <LandingHeader />
        <div className={shell.page}>{children}</div>
        <LandingFooter />
      </Providers>
    </NextIntlClientProvider>
  );
}

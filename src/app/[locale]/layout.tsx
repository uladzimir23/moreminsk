import { type Locale, routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { lora, manrope } from "../fonts";
import "../globals.scss";

export const metadata: Metadata = {
  title: "Море Minsk — аренда яхт на Минском море",
  description:
    "Парусные и моторные яхты в аренду на Минском водохранилище. Прогулки, мероприятия, пакеты под ключ.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Anti-FOUC theme bootstrap (ADR-006). Runs before React hydration so the
// correct `.{light,dark}-theme` class is on <html>+<body> for the first paint.
const themeBootstrap = `(function(){try{var s=localStorage.getItem('moreminsk-theme');var t=s==='dark'||s==='light'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;d.classList.add(t+'-theme');document.body&&document.body.classList.add(t+'-theme');d.style.colorScheme=t;}catch(e){}})();`;

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
    <html lang={typedLocale} className={`${manrope.variable} ${lora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <NextIntlClientProvider locale={typedLocale}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

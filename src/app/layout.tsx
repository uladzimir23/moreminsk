import type { Metadata } from "next";
import { lora, manrope } from "./fonts";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Море Minsk — аренда яхт на Минском море",
  description:
    "Парусные и моторные яхты в аренду на Минском водохранилище. Прогулки, мероприятия, пакеты под ключ.",
};

// Anti-FOUC theme bootstrap (ADR-006). Runs before React hydration so the
// correct `.{light,dark}-theme` class is on <html>+<body> for the first paint.
const themeBootstrap = `(function(){try{var s=localStorage.getItem('moreminsk-theme');var t=s==='dark'||s==='light'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;d.classList.add(t+'-theme');document.body&&document.body.classList.add(t+'-theme');d.style.colorScheme=t;}catch(e){}})();`;

// `lang` is set statically to the default locale (ru). `output: "export"` +
// per-locale dynamic <html lang> would require middleware we can't have.
// The [locale]/layout fragment wraps children with NextIntlClientProvider.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

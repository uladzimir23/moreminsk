import { SITE } from "@/shared/lib/seo";
import { KitPointer } from "@/shared/ui/kit-pointer/KitPointer";
import type { Metadata } from "next";
import { lora, manrope } from "./fonts";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Аренда яхт на Минском море — от 150 BYN/час | Море Minsk",
    template: "%s | Море Minsk",
  },
  description:
    "Парусные и моторные яхты в аренду на Минском водохранилище: свидания, дни рождения, корпоративы, фотосессии. Капитан и топливо в цене. Бронируйте онлайн.",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "ru_RU",
    images: [SITE.defaultOgImage],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

// Anti-FOUC theme bootstrap (ADR-006). Runs before React hydration so the
// correct `.{light,dark}-theme` class is on <html>+<body> for the first paint.
const themeBootstrap = `(function(){try{var s=localStorage.getItem('moreminsk-theme');var t=s==='dark'||s==='light'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var d=document.documentElement;d.classList.add(t+'-theme');document.body&&document.body.classList.add(t+'-theme');d.style.colorScheme=t;}catch(e){}})();`;

// Яндекс.Метрика — стандартный сниппет. Counter 109432914 (тот же, что на
// старой Tilda — moreminsk.by). webvisor + clickmap + trackLinks + accurate-
// TrackBounce. Грузится async, без блокировки рендера.
const yandexMetrika = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(109432914,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`;

// `lang` is set statically to the default locale (ru). `output: "export"` +
// per-locale dynamic <html lang> would require middleware we can't have.
// The [locale]/layout fragment wraps children with NextIntlClientProvider.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: yandexMetrika }} async />
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/109432914"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {children}
        <KitPointer />
      </body>
    </html>
  );
}

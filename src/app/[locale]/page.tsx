import type { Locale } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <h1>Море Minsk</h1>
      <p>Скоро здесь будет аренда яхт на Минском море.</p>
    </main>
  );
}

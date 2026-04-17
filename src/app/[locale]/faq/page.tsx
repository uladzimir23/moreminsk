import { type Locale } from "@/i18n/routing";
import { FaqPage } from "@/widgets/faq-page/FaqPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "FAQ — частые вопросы об аренде яхт",
  description:
    "Ответы на вопросы о бронировании, оплате, флоте и условиях аренды яхт на Минском море.",
};

export default async function FaqRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <FaqPage />
    </main>
  );
}

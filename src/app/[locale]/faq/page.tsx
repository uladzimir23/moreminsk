import { type Locale } from "@/i18n/routing";
import { FAQ } from "@/shared/content/faq";
import { breadcrumbSchema, faqPageSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { FaqPage } from "@/widgets/faq-page/FaqPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/faq",
    title: "Вопросы и ответы об аренде яхты",
    description:
      "Как забронировать, минимум по времени, что входит в цену, оплата и предоплата, отмена из-за погоды — частые вопросы об аренде яхт на Минском море.",
  });
}

export default async function FaqRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={[
          faqPageSchema(FAQ),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Вопросы", path: "/faq" },
            ],
            locale,
          ),
        ]}
      />
      <FaqPage />
    </main>
  );
}

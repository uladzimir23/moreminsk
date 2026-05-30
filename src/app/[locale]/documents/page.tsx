import { type Locale } from "@/i18n/routing";
import { DOCUMENTS } from "@/shared/content/documents";
import { breadcrumbSchema, faqPageSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { DocumentsPage } from "@/widgets/documents-page/DocumentsPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/documents",
    title: "Документы — оферта, ТБ, согласие на ПДн",
    description:
      "Договор публичной оферты, правила безопасности на яхте и согласие на обработку персональных данных. ИП Киселёва И.А., аренда яхт на Минском море.",
  });
}

export default async function DocumentsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  // FAQPage-схема для документов — Google сообщает, что у нас есть структурированные
  // юр.документы. body берём первыми 300 символами каждого, без перегруза.
  const faqItems = DOCUMENTS.map((doc) => ({
    question: doc.title,
    answer: doc.paragraphs.slice(0, 3).join(" ").slice(0, 300),
  }));

  return (
    <main>
      <JsonLd
        data={[
          faqPageSchema(faqItems),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Документы", path: "/documents" },
            ],
            locale,
          ),
        ]}
      />
      <DocumentsPage />
    </main>
  );
}

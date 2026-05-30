import { type Locale } from "@/i18n/routing";
import { CERTIFICATE } from "@/shared/content/certificates";
import { breadcrumbSchema, faqPageSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { CertificatesPage } from "@/widgets/certificates-page/CertificatesPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/sertifikaty",
    title: "Подарочный сертификат на прогулку на яхте в Минске",
    description:
      "Подарочный сертификат на прогулку под парусом или мотором по Минскому морю — от 150 BYN. Действует весь сезон, заказать можно онлайн.",
    // Букет с сертификатом — сильный визуал для соцшеров (Telegram/WhatsApp).
    images: [CERTIFICATE.photos[0]],
  });
}

export default async function CertificatesRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={[
          faqPageSchema(CERTIFICATE.faq),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Сертификаты", path: "/sertifikaty" },
            ],
            locale,
          ),
        ]}
      />
      <CertificatesPage />
    </main>
  );
}

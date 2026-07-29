import { type Locale } from "@/i18n/routing";
import { breadcrumbSchema, localBusinessSchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { ContactsPage } from "@/widgets/contacts-page/ContactsPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/contacts",
    title: "Контакты — причал в Ждановичах",
    description:
      "Телефоны, Telegram, Viber, адрес причала в Ждановичах (25 минут от центра Минска) и часы работы 9:00–22:00. Ответим за 30 минут.",
  });
}

export default async function ContactsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={[
          localBusinessSchema(),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Контакты", path: "/contacts" },
            ],
            locale,
          ),
        ]}
      />
      <ContactsPage />
    </main>
  );
}

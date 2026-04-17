import { type Locale } from "@/i18n/routing";
import { ContactsPage } from "@/widgets/contacts-page/ContactsPage";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: "Контакты — Море Minsk",
  description:
    "Телефоны, Telegram, Viber, адрес причала в Ждановичах и часы работы. Ответим за 30 минут.",
};

export default async function ContactsRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <ContactsPage />
    </main>
  );
}

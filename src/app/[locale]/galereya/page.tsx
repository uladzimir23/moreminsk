import { type Locale, routing } from "@/i18n/routing";
import { breadcrumbSchema, imageGallerySchema } from "@/shared/lib/schema";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/ui/json-ld/JsonLd";
import { GalleryPage } from "@/widgets/gallery-page/GalleryPage";
import { GALLERY } from "@/widgets/landing/_data/photos";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/galereya",
    title: "Фото яхт и мероприятий на Минском море",
    description:
      "Живые фото яхт EVA, ALFA, MARIO, BRAVO и мероприятий — свиданий, дней рождений, девичников, фотосессий на воде. Смотрите и выбирайте.",
  });
}

export default async function GalereyaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <JsonLd
        data={[
          imageGallerySchema(
            "Галерея — Море Minsk",
            GALLERY.map((shot) => shot.url),
          ),
          breadcrumbSchema(
            [
              { name: "Главная", path: "/" },
              { name: "Галерея", path: "/galereya" },
            ],
            locale,
          ),
        ]}
      />
      <GalleryPage />
    </main>
  );
}

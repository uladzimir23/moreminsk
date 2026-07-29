import { YACHTS } from "@/shared/content/yachts";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { COVER_BY_YACHT, GALLERY } from "@/widgets/landing/_data/photos";
import { GalleryGrid } from "./GalleryGrid";
import styles from "./GalleryPage.module.scss";

const YACHT_COVERS = YACHTS.map((y) => COVER_BY_YACHT[y.slug as keyof typeof COVER_BY_YACHT]);

// Dedicated /galereya page — the full photo set as an interactive masonry grid
// (click → lightbox), filterable by yacht. The home section is a single-frame
// viewer; this is the «see everything» destination.
export function GalleryPage() {
  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Галерея" }]}
          eyebrow="Галерея"
          title="Фото яхт и мероприятий"
          accent="на Минском море"
          lead="Живые кадры с выходов: яхты EVA, ALFA, MARIO, BRAVO, свидания, дни рождения, девичники и фотосессии на воде."
          image={COVER_BY_YACHT.eva}
          titleId="gallery-title"
        />
      }
    >
      <section className={styles.section} aria-labelledby="gallery-title">
        <AmbientBackdrop images={YACHT_COVERS} activeIndex={0} className={styles.sectionBg} />
        <SectionHeader eyebrow="Галерея" title="Кадры" accent="с воды" tone="media" framed />
        <GalleryGrid photos={GALLERY} />
      </section>
    </PageShell>
  );
}

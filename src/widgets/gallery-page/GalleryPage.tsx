import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT, GALLERY } from "@/widgets/landing/_data/photos";
import styles from "./GalleryPage.module.scss";

// Dedicated /galereya page — the full photo set in a grid (the home section is
// a single-frame viewer; this is the «see everything» destination).
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
        <div className={styles.container}>
          {[
            GALLERY.slice(0, Math.ceil(GALLERY.length / 2)),
            GALLERY.slice(Math.ceil(GALLERY.length / 2)),
          ].map((row, r) => (
            <div className={styles.marquee} key={r}>
              <div className={`${styles.track}${r === 1 ? ` ${styles.trackReverse}` : ""}`}>
                {/* Row rendered twice so translateX(-50%) loops seamlessly. */}
                {[...row, ...row].map((shot, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={`${shot.url}-${i}`}
                    className={styles.shot}
                    src={shot.url}
                    alt={i < row.length ? shot.alt : ""}
                    aria-hidden={i < row.length ? undefined : true}
                    loading={r === 0 && i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

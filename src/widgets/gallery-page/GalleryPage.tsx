import { Link } from "@/i18n/navigation";
import { GALLERY } from "@/widgets/landing/_data/photos";
import styles from "./GalleryPage.module.scss";

// Dedicated /galereya page — the full photo set in a grid (the home section is
// a single-frame viewer; this is the «see everything» destination).
export function GalleryPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.container}>
          <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
            <Link href="/" className={styles.crumbLink}>
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <span>Галерея</span>
          </nav>
          <h1 className={styles.h1}>Фото яхт и мероприятий на Минском море</h1>
          <p className={styles.lead}>
            Живые кадры с выходов: яхты EVA, ALFA, MARIO, BRAVO, свидания, дни рождения, девичники и
            фотосессии на воде.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {GALLERY.map((shot, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={shot.url}
                className={styles.tile}
                src={shot.url}
                alt={shot.alt}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

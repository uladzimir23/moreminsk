import { REVIEWS } from "@/shared/content/reviews";
import styles from "./reviews-section.module.scss";

const OCCASION_LABEL: Record<string, string> = {
  svidanie: "Свидание",
  "den-rozhdeniya": "День рождения",
  fotosessiya: "Фотосессия",
  korporativ: "Корпоратив",
  devichnik: "Девичник",
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function ReviewsSection() {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.head}>
        <p className={styles.eyebrow}>04 · Отзывы</p>
        <h2 className={styles.title}>
          Что говорят <span className={styles.accent}>гости.</span>
        </h2>
      </div>

      <div className={styles.grid}>
        {REVIEWS.map((review) => (
          <article className={styles.card} key={review.id}>
            <span className={styles.quoteMark} aria-hidden="true">
              &ldquo;
            </span>

            <div className={styles.stars} aria-label={`Оценка ${review.rating} из 5`}>
              {Array.from({ length: review.rating }).map((_, i) => (
                <svg
                  key={i}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <p className={styles.text}>{review.text}</p>

            <div className={styles.foot}>
              <span className={styles.author}>
                <span className={styles.authorName}>{review.authorName}</span>
                <span className={styles.date}>{formatDate(review.date)}</span>
              </span>
              <span className={styles.tag}>
                {OCCASION_LABEL[review.occasionType] ?? review.occasionType}
                {review.yachtSlug ? ` · ${review.yachtSlug.toUpperCase()}` : ""}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

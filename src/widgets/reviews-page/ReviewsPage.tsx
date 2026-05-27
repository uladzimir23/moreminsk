import { Link } from "@/i18n/navigation";
import { REVIEWS } from "@/shared/content/reviews";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import { Star } from "lucide-react";
import styles from "./ReviewsPage.module.scss";

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long" });

export function ReviewsPage() {
  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Отзывы" }]}
          eyebrow="Отзывы"
          title="Отзывы о прогулках"
          accent="на яхте"
          lead="Что пишут гости после выходов на Минском море. Каждый отзыв — про конкретную яхту и повод."
          image={COVER_BY_YACHT.mario}
          titleId="reviews-title"
        />
      }
    >
      <section className={styles.section} aria-labelledby="reviews-title">
        <div className={styles.container}>
          <ul className={styles.list}>
            {REVIEWS.map((review) => {
              const occasion = SERVICES.find((s) => s.slug === review.occasionType)?.shortTitle;
              const yacht = YACHTS.find((y) => y.slug === review.yachtSlug);
              return (
                <li key={review.id} className={styles.card}>
                  <div className={styles.stars} aria-label={`Оценка ${review.rating} из 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={i < review.rating ? styles.starOn : styles.star}
                        fill={i < review.rating ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className={styles.text}>{review.text}</p>
                  <footer className={styles.meta}>
                    <span className={styles.author}>{review.authorName}</span>
                    <span className={styles.tags}>
                      {occasion && <span className={styles.tag}>{occasion}</span>}
                      {yacht && (
                        <Link href={`/fleet/${yacht.slug}`} className={styles.tagLink}>
                          {yacht.name}
                        </Link>
                      )}
                      <time className={styles.date} dateTime={review.date}>
                        {monthYear(review.date)}
                      </time>
                    </span>
                  </footer>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

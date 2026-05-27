import type { Review } from "@/entities/review/model/types";
import { Link } from "@/i18n/navigation";
import { REVIEWS } from "@/shared/content/reviews";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import clsx from "clsx";
import { Star } from "lucide-react";
import styles from "./ReviewsPage.module.scss";

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long" });
const initial = (name: string) => name.trim().charAt(0).toUpperCase();

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={styles.star}
          fill={i < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewCard({ review, featured }: { review: Review; featured?: boolean }) {
  const occasion = SERVICES.find((s) => s.slug === review.occasionType)?.shortTitle;
  const yacht = YACHTS.find((y) => y.slug === review.yachtSlug);
  const cover = COVER_BY_YACHT[review.yachtSlug as keyof typeof COVER_BY_YACHT];

  return (
    <article className={clsx(styles.card, featured && styles.cardFeatured)}>
      {cover && <AmbientBackdrop images={[cover]} activeIndex={0} className={styles.cardBg} />}
      {featured && (
        <span className={styles.quoteMark} aria-hidden="true">
          «
        </span>
      )}
      <Stars rating={review.rating} />
      <p className={styles.text}>{review.text}</p>
      <footer className={styles.meta}>
        <span className={styles.avatar} aria-hidden="true">
          {initial(review.authorName)}
        </span>
        <span className={styles.who}>
          <span className={styles.author}>{review.authorName}</span>
          <span className={styles.tagRow}>
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
        </span>
      </footer>
    </article>
  );
}

const YACHT_COVERS = YACHTS.map((y) => COVER_BY_YACHT[y.slug as keyof typeof COVER_BY_YACHT]);

export function ReviewsPage() {
  const [featured, ...rest] = REVIEWS;

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
        <AmbientBackdrop images={YACHT_COVERS} activeIndex={0} className={styles.sectionBg} />
        <SectionHeader eyebrow="Гости" title="Что говорят" accent="на воде" tone="media" framed />

        <div className={styles.inner}>
          {featured && <ReviewCard review={featured} featured />}
          {rest.length > 0 && (
            <ul className={styles.grid}>
              {rest.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageShell>
  );
}

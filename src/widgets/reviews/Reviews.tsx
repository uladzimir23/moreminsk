import { ReviewCard } from "@/entities/review/ui/ReviewCard";
import { REVIEWS } from "@/shared/content/reviews";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import styles from "./Reviews.module.scss";

export function Reviews() {
  return (
    <section className={styles.root} aria-labelledby="reviews-title">
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Отзывы"
          title="Что говорят гости"
          subtitle="Образцы отзывов на основе реальных паттернов из Instagram и Google Reviews. Настоящие — после запуска."
          id="reviews-title"
        />

        <div className={styles.grid}>
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

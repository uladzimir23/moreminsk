import type { Review } from "@/entities/review/model/types";
import { Accent } from "@/shared/ui/accent/Accent";
import { Star } from "lucide-react";
import styles from "./ReviewCard.module.scss";

const DATE_FMT = new Intl.DateTimeFormat("ru-BY", { month: "long", year: "numeric" });

export function ReviewCard({ review }: { review: Review }) {
  const formatted = DATE_FMT.format(new Date(review.date));

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <div className={styles.author}>
          <span className={styles.avatar} aria-hidden="true">
            {review.authorName.charAt(0)}
          </span>
          <div>
            <p className={styles.name}>{review.authorName}</p>
            <p className={styles.date}>{formatted}</p>
          </div>
        </div>
        <div className={styles.rating} aria-label={`Оценка ${review.rating} из 5`}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className={styles.star} aria-hidden="true" />
          ))}
        </div>
      </div>

      <blockquote className={styles.quote}>
        <Accent as="span" upright className={styles.quoteMarks} aria-hidden="true">
          «
        </Accent>
        <p className={styles.text}>{review.text}</p>
      </blockquote>
    </article>
  );
}

"use client";

import { INSTAGRAM_STORIES } from "@/shared/content/instagram-stories";
import { withBase } from "@/shared/lib/base-path";
import { ArrowUpRight } from "lucide-react";
import styles from "./InstagramStories.module.scss";

// Lucide-react не экспортирует Instagram-иконку — inline SVG (тот же
// 24x24 viewBox, чтобы вписаться в .igTag/.profileBtn размеры).
const IgIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { year: "numeric", month: "long" });

// Stories-карусель из @moreminsk.by Instagram — Hi-aspect (9:16) карточки
// с обложкой, gradient-scrim снизу и подписью гостя. Горизонтальный scroll-snap
// рельс на mobile, обычная сетка ≥md (4 в ряд). Каждая карточка — ссылка на
// пост/Stories Highlight.
export function InstagramStories() {
  return (
    <section className={styles.root} aria-labelledby="ig-stories-title">
      <header className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>Истории клиентов</span>
          <h2 id="ig-stories-title" className={styles.title}>
            Гости отмечают нас <span className={styles.titleAccent}>в Instagram</span>
          </h2>
          <p className={styles.lead}>
            Скриншоты из Stories и постов с тегом @moreminsk.by — без модерации, прямо как
            опубликовали гости.
          </p>
        </div>
        <a
          href="https://instagram.com/moreminsk.by"
          target="_blank"
          rel="noreferrer"
          className={styles.profileBtn}
        >
          <IgIcon />
          @moreminsk.by
          <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <ul className={styles.rail} aria-label="Истории клиентов из Instagram">
        {INSTAGRAM_STORIES.map((story) => (
          <li key={story.id} className={styles.card}>
            <a href={story.url} target="_blank" rel="noreferrer" className={styles.cardLink}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={withBase(story.cover)}
                alt={story.caption}
                className={styles.cover}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.scrim} aria-hidden="true" />
              <IgIcon className={styles.igTag} />
              <div className={styles.body}>
                <p className={styles.caption}>{story.caption}</p>
                <div className={styles.meta}>
                  <span className={styles.author}>{story.author}</span>
                  <span className={styles.date}>{monthYear(story.date)}</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

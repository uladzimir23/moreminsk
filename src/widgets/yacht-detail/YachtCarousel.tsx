"use client";

import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./YachtCarousel.module.scss";
import type { OtherYacht } from "./YachtDetail";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

// Cross-sell carousel of the other yachts — same swipe mechanics as the home
// services carousel (scroll-snap rail + pager + arrows), poster cards.
export function YachtCarousel({ items }: { items: ReadonlyArray<OtherYacht> }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const i = slideRefs.current.findIndex((el) => el === entry.target);
          if (i >= 0 && entry.intersectionRatio > 0.6) setActive(i);
        });
      },
      { threshold: [0, 0.6, 0.9], root: trackRef.current },
    );
    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((i: number) => {
    slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);
  const next = () => scrollTo(Math.min(items.length - 1, active + 1));
  const prev = () => scrollTo(Math.max(0, active - 1));

  return (
    <div className={styles.rail}>
      <div className={styles.track} ref={trackRef}>
        {items.map((y, i) => (
          <article
            key={y.slug}
            className={styles.slide}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
          >
            <Link href={`/fleet/${y.slug}`} className={styles.card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.photo}
                src={y.cover}
                alt={`Яхта ${y.name}`}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.scrim} aria-hidden="true" />
              <span className={styles.body}>
                <span className={styles.type}>
                  {TYPE_LABEL[y.type]}
                  {y.badge === "flagship" ? " · флагман" : ""}
                </span>
                <span className={styles.name}>{y.name}</span>
                <span className={styles.price}>
                  <span className={styles.priceFrom}>от</span>
                  {y.pricePerHour}
                  <span className={styles.priceUnit}>BYN/ч</span>
                </span>
              </span>
            </Link>
          </article>
        ))}
      </div>

      {items.length > 1 && (
        <div className={styles.controls}>
          <nav className={styles.indicator} aria-label="Другие яхты">
            {items.map((y, i) => (
              <button
                key={y.slug}
                type="button"
                className={i === active ? styles.dotActive : styles.dot}
                onClick={() => scrollTo(i)}
                aria-current={i === active}
                aria-label={`${y.name} (${i + 1} из ${items.length})`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </nav>

          <div className={styles.arrows}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={prev}
              disabled={active === 0}
              aria-label="Предыдущая яхта"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={next}
              disabled={active === items.length - 1}
              aria-label="Следующая яхта"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

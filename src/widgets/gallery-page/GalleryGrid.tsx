"use client";

import { YACHTS } from "@/shared/content/yachts";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./GalleryPage.module.scss";

type Shot = { url: string; yacht: string; alt: string };

const FILTERS = [
  { value: "all", label: "Все" },
  ...YACHTS.map((y) => ({ value: y.slug, label: y.name })),
];

// Masonry grid (CSS columns → no crop) + click-to-lightbox + yacht filter chips.
export function GalleryGrid({ photos }: { photos: ReadonlyArray<Shot> }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);

  const shown = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.yacht === filter)),
    [filter, photos],
  );

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % shown.length)),
    [shown.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + shown.length) % shown.length)),
    [shown.length],
  );

  // Keyboard nav + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, next, prev]);

  const current = active !== null ? shown[active] : null;

  return (
    <div className={styles.inner}>
      <div className={styles.filters} role="tablist" aria-label="Фильтр по яхте">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            className={filter === f.value ? styles.chipActive : styles.chip}
            onClick={() => {
              setFilter(f.value);
              setActive(null);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className={styles.grid}>
        {shown.map((shot, i) => (
          <li key={shot.url} className={styles.tile}>
            <button
              type="button"
              className={styles.tileBtn}
              onClick={() => setActive(i)}
              aria-label={`Открыть фото: ${shot.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.tileImg}
                src={shot.url}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото"
          onClick={close}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.lightboxImg}
            src={current.url}
            alt={current.alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" className={styles.lbClose} onClick={close} aria-label="Закрыть">
            <X aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.lbNav} ${styles.lbPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Предыдущее"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.lbNav} ${styles.lbNext}`}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Следующее"
          >
            <ChevronRight aria-hidden="true" />
          </button>
          <span className={styles.lbCounter}>
            {(active ?? 0) + 1} / {shown.length}
          </span>
        </div>
      )}
    </div>
  );
}

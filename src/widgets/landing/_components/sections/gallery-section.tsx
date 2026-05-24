"use client";

import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useCallback, useEffect, useState } from "react";
import { GALLERY } from "../../_data/photos";
import styles from "./gallery-section.module.scss";

export function GallerySection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = useCallback(() => {
    setActiveIdx((i) => (i + 1) % GALLERY.length);
  }, []);
  const prev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + GALLERY.length) % GALLERY.length);
  }, []);

  // Keyboard navigation when the viewer area has focus (or anywhere on
  // the page while no input is focused).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const active = GALLERY[activeIdx];

  return (
    <section className={styles.section} id="gallery">
      {/* Ambient section backdrop — blurred copy of the active photo. */}
      <div className={styles.backdrop} aria-hidden="true">
        {GALLERY.map((shot, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`section-bg-${shot.url}`}
            src={shot.url}
            alt=""
            className={i === activeIdx ? styles.backdropImgActive : styles.backdropImg}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className={styles.backdropOverlay} />
      </div>

      <SectionHeader
        eyebrow="03 · Галерея"
        title="Атмосфера"
        accent="на воде."
        tone="media"
        framed
      />

      <div className={styles.viewer}>
        <div className={styles.frame}>
          {/* Stack of blurred backgrounds (cover) — one per photo */}
          {GALLERY.map((shot, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`bg-${shot.url}`}
              src={shot.url}
              alt=""
              className={i === activeIdx ? styles.bgActive : styles.bg}
              loading={i === 0 ? "eager" : "lazy"}
              aria-hidden="true"
            />
          ))}

          {/* Stack of crisp foreground photos (contain) — one per photo */}
          {GALLERY.map((shot, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`fg-${shot.url}`}
              src={shot.url}
              alt={shot.alt}
              className={i === activeIdx ? styles.photoActive : styles.photo}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}

          <div className={styles.controlsOverlay} aria-hidden="true" />

          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={prev}
            aria-label="Предыдущее фото"
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
            className={`${styles.nav} ${styles.navNext}`}
            onClick={next}
            aria-label="Следующее фото"
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

          <span className={styles.tag} key={`tag-${activeIdx}`}>
            <span className={styles.tagDot} aria-hidden="true" />
            {active.yacht}
          </span>
          <span className={styles.counter} aria-live="polite">
            {String(activeIdx + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
          </span>
        </div>

        <div className={styles.thumbs} role="tablist" aria-label="Все фото галереи">
          {GALLERY.map((shot, i) => (
            <button
              key={shot.url}
              role="tab"
              type="button"
              aria-selected={i === activeIdx}
              aria-label={`Фото ${i + 1} — ${shot.yacht}`}
              className={i === activeIdx ? styles.thumbActive : styles.thumb}
              onClick={() => setActiveIdx(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shot.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

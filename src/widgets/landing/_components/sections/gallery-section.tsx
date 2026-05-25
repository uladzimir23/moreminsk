"use client";

import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useCallback, useEffect, useState } from "react";
import { GALLERY, thumbUrl } from "../../_data/photos";
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

  // Render only a 2-frame window (active + the one fading out) instead of all
  // 16 photos × bg+fg. Holding every full-res photo decoded is what pushed
  // low-memory machines to evict + re-decode. @starting-style fades the
  // incoming frame in, so the crossfade stays smooth with just two elements.
  const [prevIdx, setPrevIdx] = useState(0);
  useEffect(() => {
    if (prevIdx === activeIdx) return;
    const t = setTimeout(() => setPrevIdx(activeIdx), 650); // ~ .photo opacity fade
    return () => clearTimeout(t);
  }, [activeIdx, prevIdx]);
  const frames = prevIdx === activeIdx ? [activeIdx] : [prevIdx, activeIdx];

  return (
    <section className={styles.section} id="gallery">
      {/* Ambient section backdrop — blurred copy of the active photo. */}
      <AmbientBackdrop images={GALLERY.map((shot) => shot.url)} activeIndex={activeIdx} />

      <SectionHeader
        eyebrow="03 · Галерея"
        title="Атмосфера"
        accent="на воде."
        tone="image"
        framed
      />

      <div className={styles.viewer}>
        <div className={styles.frame}>
          {/* Blurred background (cover) — only the windowed frames */}
          {frames.map((i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`bg-${GALLERY[i].url}`}
              src={GALLERY[i].url}
              alt=""
              className={i === activeIdx ? styles.bgActive : styles.bg}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          ))}

          {/* Crisp foreground photo (contain) — only the windowed frames */}
          {frames.map((i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`fg-${GALLERY[i].url}`}
              src={GALLERY[i].url}
              alt={GALLERY[i].alt}
              className={i === activeIdx ? styles.photoActive : styles.photo}
              loading="lazy"
              decoding="async"
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
              <img src={thumbUrl(shot.url)} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

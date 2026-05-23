"use client";

import { YACHTS } from "@/shared/content/yachts";
import { useCallback, useEffect, useState } from "react";
import { PHOTOS_BY_YACHT, type YachtSlug } from "../../_data/photos";
import styles from "./fleet-showcase-section.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

export function FleetShowcaseSection() {
  const [activeYachtIdx, setActiveYachtIdx] = useState(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const activeYacht = YACHTS[activeYachtIdx];
  const photos = PHOTOS_BY_YACHT[activeYacht.slug as YachtSlug];

  const nextPhoto = useCallback(() => {
    setActivePhotoIdx((i) => (i + 1) % photos.length);
  }, [photos.length]);
  const prevPhoto = useCallback(() => {
    setActivePhotoIdx((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard: arrows page through photos; arrows/esc also drive the zoom view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPhoto, prevPhoto]);

  // Lock body scroll while zoomed.
  useEffect(() => {
    if (!zoomed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [zoomed]);

  return (
    <section className={styles.section} id="fleet">
      {/* Ambient backdrop — same photos as the hero stack, heavily blurred
          and dimmed so the foreground reads white-on-dark while the active
          yacht photo provides the atmosphere. */}
      <div className={styles.backdrop} aria-hidden="true">
        {photos.map((url, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`bg-${url}`}
            src={url}
            alt=""
            className={i === activePhotoIdx ? styles.backdropImgActive : styles.backdropImg}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className={styles.backdropOverlay} />
      </div>

      <header className={styles.head}>
        <p className={styles.eyebrow}>01 · Флот</p>
        <h2 className={styles.title}>
          Четыре яхты — выбирайте <span className={styles.accent}>настроение.</span>
        </h2>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Выбор яхты">
        {YACHTS.map((yacht, i) => (
          <button
            key={yacht.slug}
            role="tab"
            type="button"
            aria-selected={i === activeYachtIdx}
            className={i === activeYachtIdx ? styles.tabActive : styles.tab}
            onClick={() => {
              setActiveYachtIdx(i);
              setActivePhotoIdx(0);
            }}
          >
            {yacht.name}
            {yacht.badge === "flagship" && <span className={styles.tabBadge}>флагман</span>}
          </button>
        ))}
      </div>

      <div className={styles.body} key={activeYacht.slug}>
        <aside className={styles.info}>
          <p className={styles.specs}>
            {TYPE_LABEL[activeYacht.type]} · до {activeYacht.capacity} гостей
          </p>
          <h3 className={styles.yachtName}>{activeYacht.name}</h3>
          <p className={styles.desc}>{activeYacht.description}</p>

          <ul className={styles.features}>
            {activeYacht.features.map((f) => (
              <li key={f} className={styles.feature}>
                <span className={styles.featureDot} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>от</span>
            <span className={styles.priceValue}>{activeYacht.pricePerHour}</span>
            <span className={styles.priceSuffix}>BYN/ч · мин. {activeYacht.minHours} ч</span>
          </div>

          <a href="#booking" className={styles.cta}>
            Забронировать {activeYacht.name}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </aside>

        <div className={styles.gallery}>
          <button
            type="button"
            className={styles.heroFrame}
            onClick={() => setZoomed(true)}
            aria-label={`Открыть фото ${activeYacht.name} крупно`}
          >
            {/* Blurred bg layer — same photo, object-fit: cover, fills letterbox */}
            {photos.map((url, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`hero-bg-${url}`}
                src={url}
                alt=""
                className={i === activePhotoIdx ? styles.heroBgActive : styles.heroBg}
                loading={i === 0 ? "eager" : "lazy"}
                aria-hidden="true"
              />
            ))}
            {/* Crisp fg layer — object-fit: contain, no crop */}
            {photos.map((url, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`hero-fg-${url}`}
                src={url}
                alt={`Яхта ${activeYacht.name} на Минском море — фото ${i + 1}`}
                className={i === activePhotoIdx ? styles.imgActive : styles.img}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}

            <span className={styles.zoomHint} aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
              </svg>
            </span>
            <span className={styles.counter} aria-live="polite">
              {String(activePhotoIdx + 1).padStart(2, "0")} /{" "}
              {String(photos.length).padStart(2, "0")}
            </span>
          </button>

          <div className={styles.frameNav} aria-hidden="true">
            <button
              type="button"
              className={styles.frameArrow}
              onClick={prevPhoto}
              aria-label="Предыдущее фото"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.frameArrow}
              onClick={nextPhoto}
              aria-label="Следующее фото"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div
            className={styles.thumbs}
            role="tablist"
            aria-label={`Фото яхты ${activeYacht.name}`}
          >
            {photos.map((url, i) => (
              <button
                key={url}
                role="tab"
                type="button"
                aria-selected={i === activePhotoIdx}
                aria-label={`Фото ${i + 1}`}
                className={i === activePhotoIdx ? styles.thumbActive : styles.thumb}
                onClick={() => setActivePhotoIdx(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom view — not a modal popup: the photo scales up + centers while
          the page behind blurs (backdrop-filter on the fixed overlay). */}
      {zoomed && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Фото яхты ${activeYacht.name}`}
          onClick={() => setZoomed(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.lightboxImg}
            src={photos[activePhotoIdx]}
            alt={`Яхта ${activeYacht.name} — фото ${activePhotoIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setZoomed(false)}
            aria-label="Закрыть"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="Предыдущее фото"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="Следующее фото"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <span className={styles.lightboxCaption}>
            <span className={styles.lightboxTag}>{activeYacht.name}</span>
            {String(activePhotoIdx + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </section>
  );
}

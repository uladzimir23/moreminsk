"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./YachtGallery.module.scss";

const SWIPE_THRESHOLD = 40;

// 240px thumbnail variant living in a `tn/` subfolder beside each photo
// (public/fleet/<yacht>/tn/<name>.jpg). A full 1280px image decoded for an
// 80px thumb wastes ~5MB of bitmap memory each. Inlined here (rather than
// imported from widgets) so this shared component stays FSD-clean.
const thumbSrc = (u: string) => u.replace(/\/([^/]+)$/, "/tn/$1");

type Props = {
  photos: readonly string[];
  name: string;
  /** Per-photo alt text (else falls back to the yacht name). */
  alts?: readonly string[];
  /** Per-photo tag shown on the frame (e.g. yacht / event label). */
  tags?: readonly string[];
  zoomable?: boolean;
  eager?: boolean;
  onActiveChange?: (index: number) => void;
};

export function YachtGallery({
  photos,
  name,
  alts,
  tags,
  zoomable = false,
  eager = false,
  onActiveChange,
}: Props) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Render only a 2-frame window (active + outgoing) of the hero photo stack
  // instead of all 8 × bg+fg — holding every full-res photo decoded was the
  // memory pressure behind the "photos reload" feeling. @starting-style fades
  // the incoming frame in.
  const [prevPhotoIdx, setPrevPhotoIdx] = useState(0);
  useEffect(() => {
    if (prevPhotoIdx === activePhotoIdx) return;
    const t = setTimeout(() => setPrevPhotoIdx(activePhotoIdx), 650); // ~ .img fade
    return () => clearTimeout(t);
  }, [activePhotoIdx, prevPhotoIdx]);
  const photoFrames =
    prevPhotoIdx === activePhotoIdx ? [activePhotoIdx] : [prevPhotoIdx, activePhotoIdx];

  // Notify the consumer of the active photo (e.g. to drive an ambient backdrop).
  useEffect(() => {
    onActiveChange?.(activePhotoIdx);
  }, [activePhotoIdx, onActiveChange]);

  const nextPhoto = useCallback(() => {
    setActivePhotoIdx((i) => (i + 1) % photos.length);
  }, [photos.length]);
  const prevPhoto = useCallback(() => {
    setActivePhotoIdx((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard: arrows page through photos; esc closes the zoom view (zoomable only).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (zoomable && e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPhoto, prevPhoto, zoomable]);

  // Lock body scroll while zoomed.
  useEffect(() => {
    if (!zoomed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [zoomed]);

  // Touch swipe → page photos. didSwipe guards the frame's click (so a
  // swipe doesn't also open the zoom view) and the lightbox's close.
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    didSwipe.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      didSwipe.current = true;
      if (dx < 0) nextPhoto();
      else prevPhoto();
    }
    touchStartX.current = null;
  };
  const handleFrameClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setZoomed(true);
  };
  const handleLightboxClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setZoomed(false);
  };

  // Windowed bg (cover, fills letterbox) + fg (contain, no crop) layers.
  const frameInner = (
    <>
      {/* Blurred bg layer (cover, fills letterbox) — windowed frames */}
      {photoFrames.map((i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`hero-bg-${photos[i]}`}
          src={photos[i]}
          alt=""
          className={i === activePhotoIdx ? styles.heroBgActive : styles.heroBg}
          loading={eager && i === 0 ? "eager" : "lazy"}
          decoding="async"
          aria-hidden="true"
        />
      ))}
      {/* Crisp fg layer (contain, no crop) — windowed frames */}
      {photoFrames.map((i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`hero-fg-${photos[i]}`}
          src={photos[i]}
          alt={alts?.[i] ?? `Яхта ${name} на Минском море — фото ${i + 1}`}
          className={i === activePhotoIdx ? styles.imgActive : styles.img}
          loading={eager && i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}

      {zoomable && (
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
      )}
      {tags?.[activePhotoIdx] && (
        <span className={styles.tag} key={`tag-${activePhotoIdx}`}>
          <span className={styles.tagDot} aria-hidden="true" />
          {tags[activePhotoIdx]}
        </span>
      )}
      <span className={styles.counter} aria-live="polite">
        {String(activePhotoIdx + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
      </span>
    </>
  );

  return (
    <div className={styles.gallery}>
      {zoomable ? (
        <button
          type="button"
          className={styles.heroFrame}
          onClick={handleFrameClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label={`Открыть фото ${name} крупно`}
        >
          {frameInner}
        </button>
      ) : (
        <div className={styles.heroFrame} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {frameInner}
        </div>
      )}

      <div className={styles.frameNav} aria-hidden="true">
        <button
          type="button"
          className={`${styles.frameArrow} ${styles.frameArrowPrev}`}
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
          className={`${styles.frameArrow} ${styles.frameArrowNext}`}
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

      <div className={styles.thumbs} role="tablist" aria-label={`Фото яхты ${name}`}>
        {photos.map((url, i) => (
          <button
            key={url}
            role="tab"
            type="button"
            aria-selected={i === activePhotoIdx}
            aria-label={tags?.[i] ? `Фото ${i + 1} — ${tags[i]}` : `Фото ${i + 1}`}
            className={i === activePhotoIdx ? styles.thumbActive : styles.thumb}
            onClick={() => setActivePhotoIdx(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbSrc(url)} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>

      {/* Zoom view — not a modal popup: the photo scales up + centers while
          the page behind blurs (backdrop-filter on the fixed overlay). */}
      {zoomable && zoomed && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Фото яхты ${name}`}
          onClick={handleLightboxClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.lightboxImg}
            src={photos[activePhotoIdx]}
            alt={`Яхта ${name} — фото ${activePhotoIdx + 1}`}
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
            <span className={styles.lightboxTag}>{name}</span>
            {String(activePhotoIdx + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}

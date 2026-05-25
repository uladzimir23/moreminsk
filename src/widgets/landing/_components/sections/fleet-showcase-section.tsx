"use client";

import { YACHTS } from "@/shared/content/yachts";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useStickyCta } from "@/shared/ui/sticky-cta/StickyCtaContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS_BY_YACHT, thumbUrl, type YachtSlug } from "../../_data/photos";
import styles from "./fleet-showcase-section.module.scss";

const SWIPE_THRESHOLD = 40;

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

export function FleetShowcaseSection() {
  const [activeYachtIdx, setActiveYachtIdx] = useState(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [tabsStuck, setTabsStuck] = useState(false);

  const activeYacht = YACHTS[activeYachtIdx];
  const photos = PHOTOS_BY_YACHT[activeYacht.slug as YachtSlug];

  // Page-level CTA — «Забронировать <яхта>» rides the fixed bottom bar and
  // tracks the active yacht tab.
  const sectionRef = useStickyCta("fleet", {
    label: `Забронировать · ${activeYacht.name}`,
    icon: "arrow",
    onClick: () => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }),
  });

  // Render only a 2-frame window (active + outgoing) of the hero photo stack
  // instead of all 8 × bg+fg — holding every full-res photo decoded was the
  // memory pressure behind the "photos reload" feeling. @starting-style fades
  // the incoming frame in. prevPhotoIdx resets to 0 on yacht switch (below).
  const [prevPhotoIdx, setPrevPhotoIdx] = useState(0);
  useEffect(() => {
    if (prevPhotoIdx === activePhotoIdx) return;
    const t = setTimeout(() => setPrevPhotoIdx(activePhotoIdx), 650); // ~ .img fade
    return () => clearTimeout(t);
  }, [activePhotoIdx, prevPhotoIdx]);
  const photoFrames =
    prevPhotoIdx === activePhotoIdx ? [activePhotoIdx] : [prevPhotoIdx, activePhotoIdx];

  // Detect when the mobile tab strip is pinned, so its backdrop only turns to
  // glass while stuck (transparent at rest). Compare the tabs' live viewport
  // position to their resolved sticky `top` (driven by --landing-header-h), so
  // it stays exact regardless of the actual header height.
  const tabsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    // Resolve the sticky `top` ONCE (and on resize) — reading getComputedStyle
    // on every scroll event forced a synchronous style recalc each time, which
    // janked scrolling across the whole page. The scroll path now only does a
    // single rAF-throttled getBoundingClientRect.
    let stickyTop = parseFloat(getComputedStyle(el).top) || 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      setTabsStuck(el.getBoundingClientRect().top <= stickyTop + 1);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      stickyTop = parseFloat(getComputedStyle(el).top) || 0;
      update();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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

  return (
    <section className={styles.section} id="fleet" ref={sectionRef}>
      {/* Ambient backdrop — same photos as the hero stack, heavily blurred
          and dimmed so the foreground reads white-on-dark. */}
      <AmbientBackdrop images={photos} activeIndex={activePhotoIdx} />

      <div className={styles.head}>
        <SectionHeader
          eyebrow="01 · Флот"
          title="Четыре яхты — выбирайте"
          accent="настроение."
          tone="image"
        />
      </div>

      <div
        ref={tabsRef}
        className={`${styles.tabs} ${tabsStuck ? styles.tabsStuck : ""}`}
        role="tablist"
        aria-label="Выбор яхты"
      >
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
              setPrevPhotoIdx(0);
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
          {/* «Забронировать <яхта>» lives in the page-level bottom bar now. */}
        </aside>

        <div className={styles.gallery}>
          <button
            type="button"
            className={styles.heroFrame}
            onClick={handleFrameClick}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-label={`Открыть фото ${activeYacht.name} крупно`}
          >
            {/* Blurred bg layer (cover, fills letterbox) — windowed frames */}
            {photoFrames.map((i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`hero-bg-${photos[i]}`}
                src={photos[i]}
                alt=""
                className={i === activePhotoIdx ? styles.heroBgActive : styles.heroBg}
                loading="lazy"
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
                alt={`Яхта ${activeYacht.name} на Минском море — фото ${i + 1}`}
                className={i === activePhotoIdx ? styles.imgActive : styles.img}
                loading="lazy"
                decoding="async"
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
                <img src={thumbUrl(url)} alt="" loading="lazy" decoding="async" />
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
          onClick={handleLightboxClick}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
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

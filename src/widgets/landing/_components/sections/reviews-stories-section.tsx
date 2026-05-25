"use client";

import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useCallback, useEffect, useState } from "react";
import { STORY_GROUPS } from "../../_data/stories";
import styles from "./reviews-stories-section.module.scss";

export function ReviewsStoriesSection() {
  // open = index of the active group, or null when closed.
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const group = open !== null ? STORY_GROUPS[open] : null;

  const openGroup = (i: number) => {
    setOpen(i);
    setSlide(0);
    setPaused(false);
  };
  const close = useCallback(() => setOpen(null), []);

  const next = useCallback(() => {
    setOpen((g) => {
      if (g === null) return g;
      const slides = STORY_GROUPS[g].slides.length;
      let advanced = false;
      setSlide((s) => {
        if (s < slides - 1) {
          advanced = true;
          return s + 1;
        }
        return s;
      });
      if (advanced) return g;
      // end of group → next group, or close
      if (g < STORY_GROUPS.length - 1) {
        setSlide(0);
        return g + 1;
      }
      return null;
    });
  }, []);

  const prev = useCallback(() => {
    setOpen((g) => {
      if (g === null) return g;
      let moved = false;
      setSlide((s) => {
        if (s > 0) {
          moved = true;
          return s - 1;
        }
        return s;
      });
      if (moved) return g;
      if (g > 0) {
        setSlide(STORY_GROUPS[g - 1].slides.length - 1);
        return g - 1;
      }
      return g;
    });
  }, []);

  // Keyboard + body scroll lock while open.
  useEffect(() => {
    if (open === null) return;
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
  }, [open, close, next, prev]);

  const current = group?.slides[slide];

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.head}>
        <SectionHeader eyebrow="04 · Отзывы" title="Истории" accent="с воды." tone="image" />
      </div>

      <div className={styles.highlights}>
        {STORY_GROUPS.map((g, i) => (
          <button
            key={g.id}
            type="button"
            className={styles.highlight}
            onClick={() => openGroup(i)}
          >
            <span className={styles.ring}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.cover}
                src={g.cover}
                alt={g.title}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className={styles.label}>{g.title}</span>
            <span className={styles.weeks}>{g.weeks} нед.</span>
          </button>
        ))}
      </div>

      {group && current && (
        <div
          className={styles.viewer}
          role="dialog"
          aria-modal="true"
          aria-label="Истории — отзывы"
        >
          <span className={styles.igWordmark}>Instagram</span>
          <button type="button" className={styles.close} onClick={close} aria-label="Закрыть">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className={styles.stage}>
            {/* Left peek */}
            {open !== null && open > 0 ? (
              <div
                className={styles.peek}
                onClick={() => openGroup(open - 1)}
                role="button"
                tabIndex={-1}
                aria-hidden="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STORY_GROUPS[open - 1].cover} alt="" />
                <span className={styles.peekMeta}>
                  <span className={styles.peekTitle}>{STORY_GROUPS[open - 1].title}</span>
                  <span className={styles.peekWeeks}>{STORY_GROUPS[open - 1].weeks} нед.</span>
                </span>
              </div>
            ) : (
              <div className={styles.peek} style={{ visibility: "hidden" }} aria-hidden="true" />
            )}

            <button
              type="button"
              className={styles.arrow}
              onClick={prev}
              disabled={open === 0 && slide === 0}
              aria-label="Назад"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Active story */}
            <div
              className={styles.story}
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              onPointerLeave={() => setPaused(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.media}
                src={current.url}
                alt={`${group.title} — история ${slide + 1}`}
              />
              <div className={styles.mediaShade} aria-hidden="true" />

              <div className={styles.progress} aria-hidden="true">
                {group.slides.map((_, i) => (
                  <span key={i} className={styles.bar}>
                    <span
                      key={i === slide ? `${open}-${slide}` : `s-${i}`}
                      className={
                        i < slide
                          ? `${styles.barFill} ${styles.barFillDone}`
                          : i === slide
                            ? `${styles.barFill} ${styles.barFillActive} ${paused ? styles.paused : ""}`
                            : styles.barFill
                      }
                      onAnimationEnd={i === slide ? next : undefined}
                    />
                  </span>
                ))}
              </div>

              <div className={styles.storyHead}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.headAvatar} src={group.cover} alt="" />
                <span className={styles.headName}>{group.handle}</span>
                <span className={styles.headTime}>{group.weeks} нед.</span>
                <span className={styles.headControls}>
                  <button
                    type="button"
                    aria-label={paused ? "Играть" : "Пауза"}
                    onClick={() => setPaused((p) => !p)}
                  >
                    {paused ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                      </svg>
                    )}
                  </button>
                  <button type="button" aria-label="Звук" tabIndex={-1}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M19 5a9 9 0 0 1 0 14M15.5 8.5a4 4 0 0 1 0 7" />
                    </svg>
                  </button>
                </span>
              </div>

              {/* Tap zones (below stickers/header in z-order) */}
              <button
                type="button"
                className={`${styles.tapZone} ${styles.tapPrev}`}
                onClick={prev}
                aria-label="Предыдущее"
              />
              <button
                type="button"
                className={`${styles.tapZone} ${styles.tapNext}`}
                onClick={next}
                aria-label="Следующее"
              />

              {/* Stickers */}
              {current.location && (
                <span className={`${styles.sticker} ${styles.location}`}>
                  <span className={styles.locationPin} aria-hidden="true">
                    📍
                  </span>
                  {current.location}
                </span>
              )}
              {current.reaction && (
                <span className={`${styles.sticker} ${styles.reaction}`}>{current.reaction}</span>
              )}
              {current.poll && (
                <span className={`${styles.sticker} ${styles.poll}`}>
                  {current.poll}
                  <span className={styles.pollBar}>Да 😍</span>
                </span>
              )}
              {current.caption && (
                <span className={`${styles.sticker} ${styles.caption}`}>{current.caption}</span>
              )}
              {current.mention && (
                <span className={`${styles.sticker} ${styles.mention}`}>{current.mention}</span>
              )}
              {current.cta && (
                <span className={`${styles.sticker} ${styles.cta}`}>{current.cta}</span>
              )}

              <div className={styles.reply}>
                <input
                  className={styles.replyInput}
                  placeholder="Ответьте moreminsk.by…"
                  aria-label="Ответить"
                  onPointerDown={(e) => e.stopPropagation()}
                />
                <button type="button" className={styles.replyIcon} aria-label="Нравится">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button type="button" className={styles.replyIcon} aria-label="Поделиться">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="button" className={styles.arrow} onClick={next} aria-label="Вперёд">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Right peek */}
            {open !== null && open < STORY_GROUPS.length - 1 ? (
              <div
                className={styles.peek}
                onClick={() => openGroup(open + 1)}
                role="button"
                tabIndex={-1}
                aria-hidden="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STORY_GROUPS[open + 1].cover} alt="" />
                <span className={styles.peekMeta}>
                  <span className={styles.peekTitle}>{STORY_GROUPS[open + 1].title}</span>
                  <span className={styles.peekWeeks}>{STORY_GROUPS[open + 1].weeks} нед.</span>
                </span>
              </div>
            ) : (
              <div className={styles.peek} style={{ visibility: "hidden" }} aria-hidden="true" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

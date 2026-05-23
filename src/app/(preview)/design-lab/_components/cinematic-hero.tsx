"use client";

import { useEffect, useRef } from "react";
import styles from "./cinematic-hero.module.scss";

type CinematicHeroProps = {
  // When true the hero gets a tall scroll runway with a sticky inner; the
  // video scales up + the content fades/rises as you scroll, smoothed by a
  // lerp so it lags both directions. Used on the dedicated cinematic landing.
  pinned?: boolean;
};

export function CinematicHero({ pinned = false }: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pinned) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    if (!section || !video || !sticky) return;

    let raf = 0;
    let current = 0; // applied progress (lerped)
    let target = 0; // scroll-derived progress

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
    };

    const render = () => {
      // Lerp toward target — the 0.07 factor is the «delay»/lag both ways.
      current += (target - current) * 0.07;
      if (Math.abs(target - current) < 0.0004) current = target;

      // Video zooms in gently across the whole runway.
      const scale = 1 + current * 0.2;
      video.style.transform = `scale(${scale})`;

      // Headline fades + rises early (gone by ~0.35).
      if (content) {
        content.style.opacity = String(1 - clamp(current * 2.8));
        content.style.transform = `translateY(${current * -70}px)`;
      }

      // As the next section rises over the hero (z-index above), the still-
      // visible upper band of the hero dissolves and parallaxes up — so the
      // video fades «in place» behind the incoming section, no black gap.
      const fade = clamp((current - 0.2) / 0.7);
      sticky.style.opacity = String(1 - fade);
      sticky.style.transform = `translateY(${-current * 80}px)`;

      raf = requestAnimationFrame(render);
    };

    measure();
    render();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const inner = (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        src="/design-lab/yacht-hero.mp4"
        poster="/design-lab/yacht-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.tint} aria-hidden="true" />

      <div className={styles.stamp}>
        <span className={styles.stampDot} aria-hidden="true" />
        <span>Live · Минское море</span>
      </div>

      <div className={styles.content} ref={contentRef}>
        <span className={styles.eyebrow}>Флот 2026 · 4 яхты под парусом и мотором</span>

        <h1 className={styles.headline}>
          Парус.
          <br />
          Мотор.
          <br />
          <span className={styles.accent}>Тишина.</span>
        </h1>

        <p className={styles.sub}>
          Прогулки, мероприятия и свидания на закате на Минском водохранилище — от 150 BYN/час,
          бронирование за минуту.
        </p>

        <div className={styles.ctas}>
          <a href="#fleet" className={styles.btnPrimary}>
            Посмотреть флот
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
          <a href="#contact" className={styles.btnGlass}>
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
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            Смотреть видео
          </a>
        </div>
      </div>

      <div className={styles.meta} aria-hidden="true">
        <span className={styles.metaItem}>
          <span className={styles.metaDot} />
          EVA · ALFA · MARIO · BRAVO
        </span>
        <span className={styles.metaItem}>Видео — Минское море, июнь 2025</span>
      </div>
    </>
  );

  if (pinned) {
    return (
      <section ref={sectionRef} className={styles.pinnedSection}>
        <div className={styles.sticky} ref={stickyRef}>
          {inner}
        </div>
      </section>
    );
  }

  return <div className={styles.hero}>{inner}</div>;
}

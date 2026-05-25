"use client";

import { withBase } from "@/shared/lib/base-path";
import { type CSSProperties, useEffect, useRef } from "react";
import styles from "./cinematic-hero.module.scss";

type CinematicHeroProps = {
  // When true the hero gets a tall scroll runway with a sticky inner; the
  // video scales up + the content fades/rises as you scroll, smoothed by a
  // lerp so it lags both directions. Used on the dedicated cinematic landing.
  pinned?: boolean;
};

export function CinematicHero({ pinned = false }: CinematicHeroProps) {
  const videoSrc = withBase("/design-lab/yacht-hero.mp4");
  const videoPoster = withBase("/design-lab/yacht-hero-poster.jpg");
  const reducedMotionPosterStyle = {
    "--hero-poster-url": `url("${videoPoster}")`,
  } as CSSProperties;
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
    // The sibling after the hero is the landing content block (.overlap);
    // we fade it in via opacity as it rises over the still-opaque hero.
    const nextBlock = section?.nextElementSibling as HTMLElement | null;
    if (!section || !video || !sticky) return;

    let raf = 0;
    let running = false; // is the rAF loop currently scheduled?
    let visible = true; // is the hero on screen? (IntersectionObserver)
    let current = 0; // applied progress (lerped)
    let target = 0; // scroll-derived progress

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    const start = () => {
      // Arm the loop only if it isn't already running and the hero is in view.
      if (!running && visible) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
      start();
    };

    const render = () => {
      // Lerp toward target — the 0.07 factor is the «delay»/lag both ways.
      current += (target - current) * 0.07;
      const settled = Math.abs(target - current) < 0.0004;
      if (settled) current = target;

      // Runway phases (scrollable = 160vh, progress = scrollY / 160vh):
      //   0    → 0.14  headline fades + rises
      //   0.14 → 0.375 «pure video» pause — just the footage, gently zooming
      //   0.375 → ~0.95 next section fades in over the hero (opacity reveal)
      // The hero itself never moves — only the video zooms (approaches), so
      // there's no lifted-section black gap. It stays opaque underneath, so
      // while the next section fades in we see the video through it (no black).
      const scale = 1 + current * 0.26;
      // The video darkens as the next section starts to reveal (reveal>0),
      // so it visibly dims «behind» the incoming content.
      const reveal = clamp((current - 0.375) / 0.5);
      video.style.transform = `scale(${scale})`;
      video.style.filter = `brightness(${1 - reveal * 0.82})`;

      // Headline leaves fast, well before the pause.
      if (content) {
        content.style.opacity = String(1 - clamp(current * 7));
        content.style.transform = `translateY(${current * -60}px)`;
      }

      // Next section reveals via opacity as it rises over the opaque hero.
      if (nextBlock) {
        nextBlock.style.opacity = String(reveal);
      }

      // Self-stop once settled — no point burning a frame every ~16ms while
      // idle. A scroll/resize re-arms the loop via measure() → start().
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(render);
    };

    // Pause the video + the lerp loop whenever the hero leaves the viewport
    // (you've scrolled down to the rest of the page). Decoding video frames
    // and mutating the <video> transform/filter behind every other section
    // was the main idle cost. Re-enters cleanly on scroll back up.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          void video.play().catch(() => {});
          measure();
        } else {
          cancelAnimationFrame(raf);
          running = false;
          video.pause();
        }
      },
      { threshold: 0 },
    );
    io.observe(section);

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const inner = (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        src={videoSrc}
        poster={videoPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.tint} aria-hidden="true" />

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
        <div className={styles.sticky} ref={stickyRef} style={reducedMotionPosterStyle}>
          {inner}
        </div>
      </section>
    );
  }
  return (
    <div className={styles.hero} style={reducedMotionPosterStyle}>
      {inner}
    </div>
  );
}

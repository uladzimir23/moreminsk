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
  const lightenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pinned) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    const lighten = lightenRef.current;
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
      const reveal = clamp((current - 0.375) / 0.5);
      video.style.transform = `scale(${scale})`;
      // Dark theme: the video darkens as the next (dark) section reveals, so it
      // dims «behind» the incoming content. Light theme: the inverse — the dark
      // cinematic hero brightens into the light page. The .lighten paper wash
      // fades in (opacity = reveal) and the footage lifts a touch; cheap
      // classList read so a runtime theme toggle is picked up next frame.
      const isLight = !document.documentElement.classList.contains("dark-theme");
      if (isLight) {
        // Lighten on its own curve — starts as the headline begins to leave
        // (≈0.06) and completes before the reveal ends, so the brighten reads
        // continuously through the scroll rather than only at the hand-off.
        const lightenProg = clamp((current - 0.06) / 0.72);
        video.style.filter = `brightness(${1 + lightenProg * 0.18})`;
        if (lighten) lighten.style.opacity = String(lightenProg);
      } else {
        video.style.filter = `brightness(${1 - reveal * 0.82})`;
        if (lighten) lighten.style.opacity = "0";
      }

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
    //
    // CRITICAL: the loop also drives the content reveal (nextBlock opacity). If
    // we just park it while the hero is off-screen, .overlap freezes at opacity
    // < 1 — a giant partial-opacity composited layer over the whole page, which
    // renders blank (software GL) or as torn/stale tiles on real GPUs. So when
    // the hero is below the fold we SNAP the reveal to its end state (content
    // fully shown) before pausing; the loop resumes when it scrolls back in.
    const settleRevealed = () => {
      current = 1;
      target = 1;
      const isLight = !document.documentElement.classList.contains("dark-theme");
      video.style.transform = "scale(1.26)";
      video.style.filter = isLight ? "brightness(1.18)" : "brightness(0.18)";
      if (lighten) lighten.style.opacity = isLight ? "1" : "0";
      if (content) {
        content.style.opacity = "0";
        content.style.transform = "translateY(-60px)";
      }
      if (nextBlock) nextBlock.style.opacity = "1";
    };
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
          settleRevealed();
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
      {/* Scroll-driven lighten wash — light theme only, opacity driven by the
          rAF so the dark hero brightens into the light page as you scroll. */}
      <div className={styles.lighten} ref={lightenRef} aria-hidden="true" />

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
          Свидание, день рождения, девичник или закатный вечер на воде. Минское море, от 150 BYN/час
          — бронируем за минуту.
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

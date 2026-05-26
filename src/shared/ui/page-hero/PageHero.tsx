"use client";

import { Link } from "@/i18n/navigation";
import clsx from "clsx";
import { type ReactNode, useEffect, useRef } from "react";
import styles from "./PageHero.module.scss";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: ReactNode;
  /** Lora-italic accent word appended to the title. */
  accent?: string;
  lead?: ReactNode;
  crumbs?: ReadonlyArray<Crumb>;
  /** Blurred background photo (page-relevant). */
  image?: string;
  align?: "left" | "center";
  titleId?: string;
  /** Optional extra below the lead (e.g. specs / a CTA). */
  children?: ReactNode;
};

// Full-height hero at the top of a dedicated page: breadcrumbs → eyebrow →
// title (Lora accent) → lead → scroll cue, over a blurred page-relevant photo
// with a theme-aware wash. Gives the title its own screen instead of letting it
// blend into the content below.
export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  crumbs,
  image,
  align = "left",
  titleId,
  children,
}: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);

  // Hero content rises + fades as you scroll past it (echoes the home hero's
  // content leaving). Cheap rAF-throttled scroll map; skipped for reduced
  // motion. The blurred photo stays put behind.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = heroRef.current;
    const inner = innerRef.current;
    if (!hero || !inner) return;
    const cue = cueRef.current;
    let raf = 0;
    let ticking = false;
    const apply = () => {
      ticking = false;
      // scrollY-based (not rect.top) — the hero is sticky inside PageShell, so
      // its rect.top stays 0 while pinned; scrollY still advances as content
      // rises over it.
      const range = hero.offsetHeight * 0.65 || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      inner.style.opacity = String(1 - p);
      inner.style.transform = `translateY(${p * -64}px)`;
      if (cue) cue.style.opacity = String(Math.max(0, 1 - p * 3));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className={clsx(styles.hero, align === "center" && styles.center)}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.bg} src={image} alt="" aria-hidden="true" decoding="async" />
      )}
      <span className={styles.wash} aria-hidden="true" />

      <div ref={innerRef} className={styles.inner}>
        {crumbs && crumbs.length > 0 && (
          <nav className={styles.crumbs} aria-label="Хлебные крошки">
            {crumbs.map((c, i) => (
              <span key={c.label} className={styles.crumbItem}>
                {c.href ? (
                  <Link href={c.href} className={styles.crumbLink}>
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
                {i < crumbs.length - 1 && (
                  <span className={styles.crumbSep} aria-hidden="true">
                    /
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 id={titleId} className={styles.title}>
          {title}
          {accent && <span className={styles.accent}> {accent}</span>}
        </h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>

      <span ref={cueRef} className={styles.scrollCue} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </section>
  );
}

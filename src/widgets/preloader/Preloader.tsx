"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./Preloader.module.scss";

// Brand preloader — a little sloop sails left→right across a drifting wave,
// then the overlay fades out. Shown on a full page load; near-instant on repeat
// loads within the same session (and for reduced motion). Client-side route
// changes don't re-mount the root layout, so it doesn't reappear on nav.
export function Preloader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("mm-preloaded");
    sessionStorage.setItem("mm-preloaded", "1");
    const sailMs = seen || reduce ? 200 : 1700;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setFading(true), sailMs);
    const t2 = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = prevOverflow;
    }, sailMs + 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={clsx(styles.root, fading && styles.hide)}
      role="presentation"
      aria-hidden="true"
    >
      <div className={styles.scene}>
        {/* Drifting wave the boat sails along */}
        <svg
          className={styles.waves}
          viewBox="0 0 240 24"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            className={styles.waveBack}
            d="M-40 14 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            className={styles.waveFront}
            d="M-40 17 q12 6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* The sloop — sails across left→right (echoes the logo mark) */}
        <span className={styles.boat} aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none">
            <path d="M13 2 L13 18 L3.5 18 Z" fill="currentColor" />
            <path d="M15 7 L15 18 L23 18 Z" fill="currentColor" opacity="0.55" />
          </svg>
        </span>
      </div>

      <span className={styles.word}>
        минское <span className={styles.wordAccent}>море</span>
      </span>
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "./scene-hero.module.scss";

type Mode = "day" | "night";

const STAR_POSITIONS: ReadonlyArray<readonly [number, number, number]> = [
  // [cx, cy, r]
  [120, 80, 1],
  [220, 140, 1.4],
  [310, 60, 1],
  [420, 180, 1.2],
  [560, 90, 1],
  [690, 160, 1.3],
  [820, 50, 1],
  [950, 130, 1.1],
  [1080, 80, 1.4],
  [1200, 170, 1],
  [1320, 100, 1.2],
  [1410, 200, 0.9],
];

export function SceneHero() {
  const [mode, setMode] = useState<Mode>("day");
  const isNight = mode === "night";

  return (
    <div className={`${styles.hero} ${isNight ? styles.isNight : ""}`}>
      <div className={`${styles.scene} ${isNight ? styles.isNight : ""}`} aria-hidden="true">
        <svg
          className={styles.sceneSvg}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={styles.skyTop} />
              <stop offset="100%" className={styles.skyBottom} />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={styles.waterTop} />
              <stop offset="100%" className={styles.waterBottom} />
            </linearGradient>
            <radialGradient id="celestialGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            <filter id="cabinBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="1440" height="540" fill="url(#skyGrad)" />

          {/* Stars — only visible at night via opacity */}
          <g className={styles.starsLayer}>
            {STAR_POSITIONS.map(([cx, cy, r], i) => (
              <circle key={i} className={styles.star} cx={cx} cy={cy} r={r} />
            ))}
          </g>

          {/* Sun group */}
          <g className={styles.sunGroup}>
            <circle className={styles.celestialGlow} cx="1200" cy="220" r="120" />
            <circle className={styles.sun} cx="1200" cy="220" r="60" />
          </g>

          {/* Moon group — sits slightly higher than sun */}
          <g className={styles.moonGroup}>
            <circle className={styles.celestialGlow} cx="1200" cy="200" r="100" />
            <circle className={styles.moon} cx="1200" cy="200" r="52" />
            {/* Subtle craters */}
            <circle cx="1185" cy="190" r="6" fill="#cfd6dc" opacity="0.55" />
            <circle cx="1215" cy="210" r="4" fill="#cfd6dc" opacity="0.5" />
            <circle cx="1205" cy="180" r="3" fill="#cfd6dc" opacity="0.6" />
          </g>

          {/* Distant shore silhouette — sits at horizon */}
          <path
            className={styles.shore}
            d="M0 545 L120 538 L240 545 L360 535 L500 540 L640 537 L780 545 L920 538 L1080 543 L1220 537 L1360 545 L1440 540 L1440 558 L0 558 Z"
          />

          {/* Water */}
          <rect x="0" y="540" width="1440" height="360" fill="url(#waterGrad)" />

          {/* Reflection streak — vertical band of celestial light on water */}
          <ellipse className={styles.reflection} cx="1200" cy="780" rx="42" ry="240" />

          {/* Wave shimmer lines */}
          <g className={styles.waveGroup}>
            <path
              className={styles.wave1}
              d="M-50 620 Q200 614 450 620 T950 620 T1490 618"
              fill="none"
              strokeWidth="1"
            />
            <path
              className={styles.wave2}
              d="M-50 680 Q200 674 450 680 T950 680 T1490 678"
              fill="none"
              strokeWidth="1"
            />
            <path
              className={styles.wave3}
              d="M-50 740 Q200 734 450 740 T950 740 T1490 738"
              fill="none"
              strokeWidth="1"
            />
          </g>

          {/* Yacht silhouette — slightly left of center */}
          <g transform="translate(500 510)">
            {/* Sail — two triangles for jib + main */}
            <path d="M0 -60 L26 0 L0 0 Z" fill="#fafafa" opacity="0.94" />
            <path d="M0 -60 L-22 0 L0 0 Z" fill="#e0e7ec" opacity="0.86" />
            {/* Mast */}
            <line x1="0" y1="0" x2="0" y2="-62" stroke="#0a0a0a" strokeWidth="1.5" />
            {/* Hull */}
            <path d="M-36 28 Q-22 38 0 38 Q22 38 36 28 L28 20 L-28 20 Z" fill="#0a0a0a" />
            {/* Cabin block */}
            <rect x="-10" y="10" width="20" height="10" fill="#1a1a1a" />
            {/* Cabin window — warm glow only at night */}
            <rect
              className={styles.cabinGlow}
              x="-7"
              y="12"
              width="14"
              height="5"
              filter="url(#cabinBlur)"
            />
          </g>
        </svg>
      </div>

      <div className={styles.stamp}>
        <span className={styles.stampDot} aria-hidden="true" />
        <span>{isNight ? "Закат пройден · 21:47" : "Полдень · 13:24"}</span>
      </div>

      <button
        type="button"
        className={styles.toggle}
        onClick={() => setMode(isNight ? "day" : "night")}
        aria-label={isNight ? "Переключить на день" : "Переключить на ночь"}
      >
        {/* Sun icon */}
        <svg
          className={`${styles.toggleIcon} ${styles.toggleSun}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        {/* Moon icon */}
        <svg
          className={`${styles.toggleIcon} ${styles.toggleMoon}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <div className={styles.content}>
        <span className={styles.eyebrow}>
          {isNight ? "Закатный выход · от 150 BYN" : "Дневная прогулка · от 200 BYN"}
        </span>
        <h1 className={styles.headline}>
          {isNight ? (
            <>
              Свет на воде —<br />
              <span className={styles.accent}>главный декор.</span>
            </>
          ) : (
            <>
              Парус. Мотор.
              <br />
              <span className={styles.accent}>Тишина.</span>
            </>
          )}
        </h1>
        <p className={styles.sub}>
          {isNight
            ? "Бронируйте закатный или ночной выход на EVA, ALFA, MARIO или BRAVO — Минское море в его лучший час."
            : "Четыре яхты на Минском водохранилище. Прогулки, мероприятия, фотосессии — от 150 BYN/час."}
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
          <a href="#contact" className={styles.btnGhost}>
            Связаться
          </a>
        </div>
      </div>
    </div>
  );
}

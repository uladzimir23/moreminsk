"use client";

import { useState } from "react";
import styles from "./contact-map.module.scss";

// Click-to-load Yandex map — keeps the heavy map widget JS off the initial
// page load; the iframe only mounts after the user opts in.
const MAP_SRC =
  "https://yandex.ru/map-widget/v1/?ll=27.4032%2C54.0011&z=14&pt=27.4032%2C54.0011%2Cpm2blm";

export function ContactMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.map} aria-label="Карта — Минское море, Ждановичи">
      <span className={styles.stamp}>Карта</span>

      {loaded ? (
        <iframe
          className={styles.frame}
          src={MAP_SRC}
          title="Карта — Море Minsk, Ждановичи"
          loading="lazy"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.load} onClick={() => setLoaded(true)}>
          <svg
            className={styles.pin}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className={styles.loadLabel}>Показать карту</span>
          <span className={styles.loadHint}>Ждановичи · 54.0011, 27.4032</span>
        </button>
      )}
    </div>
  );
}

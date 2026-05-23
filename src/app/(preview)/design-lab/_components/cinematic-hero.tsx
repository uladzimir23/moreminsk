import styles from "./cinematic-hero.module.scss";

export function CinematicHero() {
  return (
    <div className={styles.hero}>
      <video
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

      <div className={styles.content}>
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
    </div>
  );
}

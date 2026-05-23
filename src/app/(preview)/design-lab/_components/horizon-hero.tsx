import styles from "./horizon-hero.module.scss";

export function HorizonHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.stamp}>
        <span className={styles.stampDot} aria-hidden="true" />
        <span>23.05.2026 · ВЫПУСК №1</span>
      </div>

      <div className={styles.horizon} aria-hidden="true" />

      <svg
        className={styles.sail}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2 L12 18" />
        <path d="M12 4 L4 16 L12 16 Z" fill="currentColor" stroke="none" opacity="0.85" />
        <path d="M3 18 L21 18" />
        <path d="M5 18 Q12 22 19 18" />
      </svg>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Флот 2026 · Минское море</span>

        <h1 className={styles.headline}>
          Парус.
          <br />
          Мотор.
          <br />
          <span className={styles.accent}>Тишина.</span>
        </h1>

        <p className={styles.sub}>
          Четыре яхты на Минском водохранилище. Прогулки, мероприятия, свидания на закате — от 150
          BYN/час, бронирование за минуту.
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

        <div className={styles.fleetRoster}>
          <span>EVA</span>
          <span className={styles.fleetSep}>·</span>
          <span>ALFA</span>
          <span className={styles.fleetSep}>·</span>
          <span>MARIO</span>
          <span className={styles.fleetSep}>·</span>
          <span>BRAVO</span>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollArrow}>↓</span>
        <span>Скролл к флоту</span>
      </div>
    </div>
  );
}

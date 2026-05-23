import { COVER_BY_YACHT } from "../../_data/photos";
import styles from "./booking-cta-section.module.scss";

export function BookingCTASection() {
  return (
    <section className={styles.section} id="booking">
      {/* Ambient blurred photo backdrop — EVA sunset, matches the dark
          editorial treatment of the fleet/services/gallery sections. */}
      <div className={styles.backdrop} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={COVER_BY_YACHT.eva} alt="" />
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.horizon} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>04 · Бронирование</p>
        <h2 className={styles.title}>
          Готовы <span className={styles.accent}>выйти в море?</span>
        </h2>
        <p className={styles.sub}>
          Выберите яхту и дату — мы перезвоним в течение 30 минут, подтвердим свободные окна и
          зафиксируем бронь авансом 30%.
        </p>

        <div className={styles.ctas}>
          <a href="#book" className={styles.btnPrimary}>
            Забронировать выход
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
          <a href="tel:+375296953636" className={styles.btnPhone}>
            +375 29 695 36 36
          </a>
        </div>
      </div>
    </section>
  );
}

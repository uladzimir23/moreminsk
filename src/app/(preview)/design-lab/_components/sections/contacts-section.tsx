import styles from "./contacts-section.module.scss";

export function ContactsSection() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.head}>
        <p className={styles.eyebrow}>07 · Контакты</p>
        <h2 className={styles.title}>
          Минское море, <span className={styles.accent}>Ждановичи.</span>
        </h2>
      </div>

      <div className={styles.grid}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <span className={styles.itemLabel}>Адрес</span>
            <span className={styles.itemValue}>
              <span>Ждановичский с/с, район д. Качино</span>
              <span>ул. Вокзальная 8а</span>
              <span>25 минут от центра Минска</span>
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>Телефоны</span>
            <span className={styles.itemValue}>
              <a href="tel:+375296953636">+375 29 695 36 36</a>
              <a href="tel:+375296109107">+375 29 6 109 107</a>
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>Мессенджеры</span>
            <span className={styles.itemValue}>
              <a href="https://t.me/moreminsk" target="_blank" rel="noreferrer">
                Telegram @moreminsk
              </a>
              <a href="https://instagram.com/moreminsk.by" target="_blank" rel="noreferrer">
                Instagram @moreminsk.by
              </a>
              <a href="mailto:9797-7@mail.ru">9797-7@mail.ru</a>
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>Часы</span>
            <span className={styles.itemValue}>
              <span>Ежедневно 9:00 – 22:00</span>
              <span>Заявки в чате — круглосуточно</span>
            </span>
          </li>
        </ul>

        <div className={styles.map} aria-label="Карта — Минское море, Ждановичи">
          <span className={styles.mapStamp}>Карта</span>
          <p className={styles.mapHint}>
            Здесь сядет click-to-load Яндекс-карта на координаты 54.0011 / 27.4032
          </p>
        </div>
      </div>
    </section>
  );
}

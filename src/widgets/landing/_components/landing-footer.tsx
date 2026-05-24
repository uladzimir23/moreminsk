import { Logo } from "@/shared/ui/logo/Logo";
import styles from "./landing-footer.module.scss";

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <a href="#top" className={styles.brand} aria-label="Минское море — на главную">
            <Logo />
          </a>
          <p className={styles.tagline}>
            Аренда парусных и моторных яхт на Минском водохранилище. Прогулки, мероприятия,
            фотосессии — от 150 BYN/час.
          </p>
          <div className={styles.socials}>
            <a
              className={styles.social}
              href="https://t.me/moreminsk"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.5 4.3 18.6 19c-.2 1-.8 1.2-1.6.7l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.36-.3-.08-.5-.55-.2l-10.1 6.4-4.4-1.4c-.95-.3-.97-.95.2-1.4L20 3c.8-.3 1.5.2 1.5 1.3z" />
              </svg>
            </a>
            <a
              className={styles.social}
              href="https://instagram.com/moreminsk.by"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <nav className={styles.col} aria-label="Разделы">
          <p className={styles.colTitle}>Разделы</p>
          <a className={styles.link} href="#fleet">
            Флот
          </a>
          <a className={styles.link} href="#services">
            Услуги
          </a>
          <a className={styles.link} href="#gallery">
            Галерея
          </a>
          <a className={styles.link} href="#reviews">
            Отзывы
          </a>
          <a className={styles.link} href="#faq">
            Вопросы
          </a>
        </nav>

        <div className={styles.col}>
          <p className={styles.colTitle}>Контакты</p>
          <a className={styles.link} href="tel:+375296953636">
            +375 29 695 36 36
          </a>
          <a className={styles.link} href="tel:+375296109107">
            +375 29 6 109 107
          </a>
          <a className={styles.link} href="mailto:9797-7@mail.ru">
            9797-7@mail.ru
          </a>
          <span className={styles.link}>Ждановичи, ул. Вокзальная 8а</span>
          <span className={styles.link}>Ежедневно 9:00 – 22:00</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 Минское море. Все права защищены.</span>
        <span className={styles.legal}>
          <a className={styles.legalLink} href="#privacy">
            Политика конфиденциальности
          </a>
          <a className={styles.legalLink} href="#offer">
            Публичная оферта
          </a>
        </span>
      </div>
    </footer>
  );
}

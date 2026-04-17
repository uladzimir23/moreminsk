import { Link } from "@/i18n/navigation";
import { CONTACTS } from "@/shared/content/contacts";
import { Camera, Mail, MessageCircle, Phone, Sailboat, Send } from "lucide-react";
import styles from "./Footer.module.scss";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/fleet", label: "Флот" },
  { href: "/services", label: "Услуги" },
  { href: "/gallery", label: "Галерея" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
  { href: "/faq", label: "FAQ" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand} aria-label="Море Minsk — на главную">
              <Sailboat className={styles.brandMark} aria-hidden="true" />
              <span>Море Minsk</span>
            </Link>
            <p className={styles.tagline}>
              Аренда парусных и моторных яхт на Минском водохранилище. Свадьбы, дни рождения,
              корпоративы, фотосессии.
            </p>
            <div className={styles.social}>
              <a
                href={CONTACTS.telegram.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Telegram"
              >
                <Send className={styles.socialIcon} aria-hidden="true" />
              </a>
              <a
                href={CONTACTS.instagram.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Camera className={styles.socialIcon} aria-hidden="true" />
              </a>
              <a href={CONTACTS.viber.href} className={styles.socialLink} aria-label="Viber">
                <MessageCircle className={styles.socialIcon} aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Навигация по сайту">
            <h3 className={styles.colTitle}>Навигация</h3>
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={styles.colTitle}>Контакты</h3>
            <ul className={styles.contactList}>
              {CONTACTS.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className={styles.contactLink}>
                    <Phone
                      className={styles.socialIcon}
                      aria-hidden="true"
                      style={{ display: "inline", marginInlineEnd: "0.5rem", verticalAlign: -2 }}
                    />
                    {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={CONTACTS.email.href} className={styles.contactLink}>
                  <Mail
                    className={styles.socialIcon}
                    aria-hidden="true"
                    style={{ display: "inline", marginInlineEnd: "0.5rem", verticalAlign: -2 }}
                  />
                  {CONTACTS.email.label}
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.telegram.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.contactLink}
                >
                  <Send
                    className={styles.socialIcon}
                    aria-hidden="true"
                    style={{ display: "inline", marginInlineEnd: "0.5rem", verticalAlign: -2 }}
                  />
                  {CONTACTS.telegram.label}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Адрес</h3>
            <address className={styles.addressItem} style={{ fontStyle: "normal" }}>
              <div className={styles.addressStrong}>{CONTACTS.address.line1}</div>
              <div>{CONTACTS.address.line2}</div>
              <div style={{ marginBlockStart: "0.5rem" }}>{CONTACTS.address.hours}</div>
            </address>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>© {year} Море Minsk. Все права защищены.</p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className={styles.legalLink}>
              Публичная оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

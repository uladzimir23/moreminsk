"use client";

import { Link } from "@/i18n/navigation";
import { submitBooking } from "@/shared/lib/booking/submit";
import { Logo } from "@/shared/ui/logo/Logo";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-footer.module.scss";

type QuickStatus = "idle" | "sending" | "done" | "error";

export function LandingFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [quick, setQuick] = useState<QuickStatus>("idle");

  // Publish the footer height as --footer-h so the page content reserves room
  // to scroll past and reveal the fixed footer beneath it.
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--footer-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onQuick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phone = String(new FormData(e.currentTarget).get("phone") ?? "").trim();
    setQuick("sending");
    try {
      await submitBooking({
        yacht: "—",
        date: "—",
        time: "—",
        name: "—",
        phone,
        service: "Быстрый звонок (футер)",
      });
      setQuick("done");
    } catch {
      setQuick("error");
    }
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />

      {/* Quick call-back capture — the first thing the reveal exposes. */}
      <div className={styles.quickWrap}>
        {quick === "done" ? (
          <p className={styles.quickDone}>Спасибо — перезвоним в течение 30 минут.</p>
        ) : (
          <form className={styles.quick} onSubmit={onQuick}>
            <span className={styles.quickLabel}>
              Оставьте телефон — <span className={styles.quickAccent}>перезвоним за 30 минут</span>
            </span>
            <div className={styles.quickRow}>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+375 __ ___ __ __"
                className={styles.quickInput}
                aria-label="Телефон"
              />
              <button type="submit" className={styles.quickBtn} disabled={quick === "sending"}>
                {quick === "sending" ? "Отправляем…" : "Жду звонка"}
              </button>
            </div>
            {quick === "error" && (
              <span className={styles.quickError}>
                Не отправилось — позвоните, пожалуйста:{" "}
                <a href="tel:+375296953636">+375 29 695 36 36</a>
              </span>
            )}
          </form>
        )}
      </div>

      <div className={styles.top}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand} aria-label="Минское море — на главную">
            <Logo />
          </Link>
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

        <nav className={`${styles.col} ${styles.navCol}`} aria-label="Разделы">
          <p className={styles.colTitle}>Разделы</p>
          <Link className={styles.link} href="/fleet">
            Флот
          </Link>
          <Link className={styles.link} href="/services">
            Услуги
          </Link>
          <Link className={styles.link} href="/ceny">
            Цены
          </Link>
          <Link className={styles.link} href="/galereya">
            Галерея
          </Link>
          <Link className={styles.link} href="/otzyvy">
            Отзывы
          </Link>
          <Link className={styles.link} href="/faq">
            Вопросы
          </Link>
          <Link className={styles.link} href="/sertifikaty">
            Сертификаты
          </Link>
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
          <Link className={styles.legalLink} href="/documents#oferta">
            Публичная оферта
          </Link>
          <Link className={styles.legalLink} href="/documents#consent">
            Обработка персональных данных
          </Link>
          <Link className={styles.legalLink} href="/documents#safety">
            ТБ на яхте
          </Link>
        </span>
      </div>
    </footer>
  );
}

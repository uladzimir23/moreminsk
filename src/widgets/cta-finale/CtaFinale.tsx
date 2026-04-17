"use client";

import { usePanel } from "@/shared/lib/panel/usePanel";
import { Accent } from "@/shared/ui/accent/Accent";
import { CalendarDays, Send } from "lucide-react";
import styles from "./CtaFinale.module.scss";

// Telegram link duplicates the bio CTA across the site. Hard-coded for now;
// will move to `src/shared/content/contacts.ts` in Phase 4.
const TELEGRAM_URL = "https://t.me/moreminsk";

export function CtaFinale() {
  const { open } = usePanel();

  return (
    <section className={styles.root} aria-labelledby="cta-finale-title">
      <div className={styles.container}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Свободные даты</span>
          <h2 id="cta-finale-title" className={styles.title}>
            Забронируйте <Accent>свою</Accent> дату
          </h2>
          <p className={styles.lead}>
            Летние выходные бронируют за 2–3 месяца. Напишите — подберём время под формат и
            зафиксируем авансом 30%.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => open("order")}
              className={`${styles.cta} ${styles.ctaPrimary}`}
            >
              <CalendarDays className={styles.ctaIcon} aria-hidden="true" />
              Посмотреть даты
            </button>
            <a
              href={TELEGRAM_URL}
              className={`${styles.cta} ${styles.ctaGhost}`}
              target="_blank"
              rel="noreferrer"
            >
              <Send className={styles.ctaIcon} aria-hidden="true" />
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

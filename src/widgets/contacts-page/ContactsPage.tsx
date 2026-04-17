"use client";

import { CONTACTS } from "@/shared/content/contacts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import {
  CalendarDays,
  Camera,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import styles from "./ContactsPage.module.scss";

export function ContactsPage() {
  const { open } = usePanel();

  return (
    <section className={styles.root} aria-labelledby="contacts-title">
      <div className={styles.container}>
        <span className={styles.eyebrow}>Контакты</span>
        <h1 id="contacts-title" className={styles.h1}>
          Связаться с нами
        </h1>
        <p className={styles.lead}>
          Отвечаем за 30 минут в рабочие часы. Выбирайте удобный канал — телефон, Telegram или
          оставьте заявку через форму.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Phone className={styles.cardIcon} aria-hidden="true" />
              Телефоны
            </h2>
            <ul className={styles.list}>
              {CONTACTS.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className={styles.link}>
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.muted}>МТС, A1 — звонки и Viber</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Send className={styles.cardIcon} aria-hidden="true" />
              Мессенджеры
            </h2>
            <ul className={styles.list}>
              <li>
                <a
                  href={CONTACTS.telegram.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  Telegram — {CONTACTS.telegram.label}
                </a>
              </li>
              <li>
                <a href={CONTACTS.viber.href} className={styles.link}>
                  Viber — {CONTACTS.viber.label}
                </a>
              </li>
            </ul>
            <p className={styles.muted}>
              <MessageCircle
                aria-hidden="true"
                style={{
                  inlineSize: "0.875rem",
                  blockSize: "0.875rem",
                  display: "inline",
                  verticalAlign: -2,
                  marginInlineEnd: "0.25rem",
                }}
              />
              Самый быстрый способ — Telegram
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Mail className={styles.cardIcon} aria-hidden="true" />
              Почта
            </h2>
            <ul className={styles.list}>
              <li>
                <a href={CONTACTS.email.href} className={styles.link}>
                  {CONTACTS.email.label}
                </a>
              </li>
            </ul>
            <p className={styles.muted}>Для документов и корпоративных заявок</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Camera className={styles.cardIcon} aria-hidden="true" />
              Соцсети
            </h2>
            <ul className={styles.list}>
              <li>
                <a
                  href={CONTACTS.instagram.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  Instagram — {CONTACTS.instagram.label}
                </a>
              </li>
            </ul>
            <p className={styles.muted}>Галерея выходов — смотрите перед бронью</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MapPin className={styles.cardIcon} aria-hidden="true" />
              Адрес причала
            </h2>
            <p className={styles.muted} style={{ color: "var(--color-foreground)" }}>
              {CONTACTS.address.line1}
            </p>
            <p className={styles.muted}>{CONTACTS.address.line2}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Clock className={styles.cardIcon} aria-hidden="true" />
              Часы работы
            </h2>
            <p className={styles.muted} style={{ color: "var(--color-foreground)" }}>
              {CONTACTS.address.hours}
            </p>
            <p className={styles.muted}>Навигационный сезон: май — октябрь</p>
          </div>
        </div>

        <div className={styles.mapSection}>
          <h2 className={styles.mapTitle}>Как добраться</h2>
          <div className={styles.mapPlaceholder}>
            <MapPin className={styles.mapIcon} aria-hidden="true" />
            <p style={{ margin: 0 }}>
              Карта загрузится по клику. {CONTACTS.address.line1} — 25 минут от центра Минска.
            </p>
            <a
              href={CONTACTS.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.mapLink}
            >
              Открыть в Яндекс.Картах
            </a>
          </div>
        </div>

        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>
            Не хотите писать в мессенджер — оставьте заявку через форму.
          </p>
          <button type="button" onClick={() => open("order")} className={styles.cta}>
            <CalendarDays className={styles.ctaIcon} aria-hidden="true" />
            Оставить заявку
          </button>
        </div>
      </div>
    </section>
  );
}

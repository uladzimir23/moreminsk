"use client";

import { CONTACTS } from "@/shared/content/contacts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
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
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Контакты" }]}
          eyebrow="Контакты"
          title="Связаться"
          accent="с нами"
          lead="Отвечаем за 30 минут в рабочие часы. Выбирайте удобный канал — телефон, Telegram или оставьте заявку через форму."
          image={COVER_BY_YACHT.eva}
          titleId="contacts-title"
        />
      }
    >
      <section className={styles.root} aria-labelledby="contacts-title">
        <div className={styles.container}>
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
                <MessageCircle className={styles.inlineIcon} aria-hidden="true" />
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
              <p className={styles.addressLine}>{CONTACTS.address.line1}</p>
              <p className={styles.muted}>{CONTACTS.address.line2}</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Clock className={styles.cardIcon} aria-hidden="true" />
                Часы работы
              </h2>
              <p className={styles.addressLine}>{CONTACTS.address.hours}</p>
              <p className={styles.muted}>Навигационный сезон: май — октябрь</p>
            </div>
          </div>

          <div className={styles.mapSection}>
            <h2 className={styles.mapTitle}>Как добраться</h2>
            <div className={styles.mapPlaceholder}>
              <MapPin className={styles.mapIcon} aria-hidden="true" />
              <p className={styles.mapText}>
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
    </PageShell>
  );
}

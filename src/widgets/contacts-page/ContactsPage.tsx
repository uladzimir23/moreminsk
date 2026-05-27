"use client";

import { CONTACTS } from "@/shared/content/contacts";
import { YACHTS } from "@/shared/content/yachts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import { ArrowUpRight, CalendarDays, Camera, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import styles from "./ContactsPage.module.scss";

const YACHT_COVERS = YACHTS.map((y) => COVER_BY_YACHT[y.slug as keyof typeof COVER_BY_YACHT]);

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
      <section className={styles.section} aria-labelledby="contacts-title">
        <AmbientBackdrop images={YACHT_COVERS} activeIndex={0} className={styles.sectionBg} />
        <SectionHeader eyebrow="Контакты" title="Каналы" accent="связи" tone="media" framed />

        <div className={styles.inner}>
          <div className={styles.grid}>
            <article className={styles.card}>
              <span className={styles.iconTile} aria-hidden="true">
                <Phone />
              </span>
              <h2 className={styles.cardTitle}>Телефоны</h2>
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
            </article>

            <article className={styles.card}>
              <span className={styles.iconTile} aria-hidden="true">
                <Send />
              </span>
              <h2 className={styles.cardTitle}>Мессенджеры</h2>
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
              <p className={styles.muted}>Самый быстрый способ — Telegram</p>
            </article>

            <article className={styles.card}>
              <span className={styles.iconTile} aria-hidden="true">
                <Mail />
              </span>
              <h2 className={styles.cardTitle}>Почта</h2>
              <ul className={styles.list}>
                <li>
                  <a href={CONTACTS.email.href} className={styles.link}>
                    {CONTACTS.email.label}
                  </a>
                </li>
              </ul>
              <p className={styles.muted}>Для документов и корпоративных заявок</p>
            </article>

            <article className={styles.card}>
              <span className={styles.iconTile} aria-hidden="true">
                <Camera />
              </span>
              <h2 className={styles.cardTitle}>Соцсети</h2>
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
            </article>

            <article className={styles.card}>
              <span className={styles.iconTile} aria-hidden="true">
                <Clock />
              </span>
              <h2 className={styles.cardTitle}>Часы работы</h2>
              <p className={styles.addressLine}>{CONTACTS.address.hours}</p>
              <p className={styles.muted}>Навигационный сезон: май — октябрь</p>
            </article>

            {/* Map / location — wide glass panel. */}
            <article className={`${styles.card} ${styles.mapCard}`}>
              <span className={styles.iconTile} aria-hidden="true">
                <MapPin />
              </span>
              <div className={styles.mapBody}>
                <h2 className={styles.cardTitle}>Причал</h2>
                <p className={styles.addressLine}>{CONTACTS.address.line1}</p>
                <p className={styles.muted}>{CONTACTS.address.line2}</p>
                <a
                  href={CONTACTS.address.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.mapLink}
                >
                  Открыть в Яндекс.Картах
                  <ArrowUpRight className={styles.mapLinkIcon} aria-hidden="true" />
                </a>
              </div>
            </article>
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

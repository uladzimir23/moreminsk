"use client";

import { QuickBooking } from "@/features/booking/QuickBooking";
import { Link } from "@/i18n/navigation";
import { CONTACTS } from "@/shared/content/contacts";
import { FAQ } from "@/shared/content/faq";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import { ArrowUpRight, Building2, Car, Clock, Copy, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import styles from "./ContactsPage.module.scss";

// First 3 «general» FAQs — мини-тизер «частые вопросы» на /contacts.
const FAQ_TEASER = FAQ.filter((f) => f.tags.includes("general")).slice(0, 3);

// Yandex Maps embed URL — POI-режим через oid (точная карточка яхт-клуба).
const yandexMapEmbedUrl = (() => {
  const { lat, lon } = CONTACTS.yandex.coords;
  const oidUri = encodeURIComponent(`ymapsbm1://org?oid=${CONTACTS.yandex.oid}`);
  return `https://yandex.com/map-widget/v1/?ll=${lon}%2C${lat}&mode=poi&poi%5Bpoint%5D=${lon}%2C${lat}&poi%5Buri%5D=${oidUri}&z=17`;
})();

export function ContactsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (value: string, field: string) => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    });
  };

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Контакты" }]}
          eyebrow="Контакты"
          title="Связаться"
          accent="с нами"
          lead="Отвечаем за 30 минут в рабочие часы. Звоните, пишите в Telegram, заходите в гости — или оставьте заявку справа, перезвоним сами."
          image={COVER_BY_YACHT.eva}
          titleId="contacts-title"
        />
      }
    >
      <section className={styles.section} aria-labelledby="contacts-title">
        <div className={styles.grid}>
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className={styles.content}>
            {/* Map */}
            <div className={styles.mapCard}>
              <iframe
                title="Минское море, яхт-клуб — Яндекс Карты"
                src={yandexMapEmbedUrl}
                className={styles.mapFrame}
                loading="lazy"
                allow="geolocation"
              />
              <a
                href={CONTACTS.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.mapOpen}
              >
                Открыть в Яндекс.Картах
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>

            {/* Channels — phones / messengers / email */}
            <div className={styles.channels}>
              <h2 className={styles.h2}>Каналы связи</h2>
              <ul className={styles.list}>
                <li className={styles.row}>
                  <Phone className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>Телефоны · МТС, А1, Viber</span>
                    {CONTACTS.phones.map((p) => (
                      <a key={p.href} href={p.href} className={styles.rowValue}>
                        {p.label}
                      </a>
                    ))}
                  </div>
                </li>
                <li className={styles.row}>
                  <Send className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>Telegram · самый быстрый</span>
                    <a
                      href={CONTACTS.telegram.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.rowValue}
                    >
                      {CONTACTS.telegram.label}
                    </a>
                  </div>
                </li>
                <li className={styles.row}>
                  <Mail className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>Почта · документы и юрлица</span>
                    <a href={CONTACTS.email.href} className={styles.rowValue}>
                      {CONTACTS.email.label}
                    </a>
                  </div>
                </li>
                <li className={styles.row}>
                  <ArrowUpRight className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>Instagram · фото-кадры с прогулок</span>
                    <a
                      href={CONTACTS.instagram.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.rowValue}
                    >
                      {CONTACTS.instagram.label}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Address + how to reach */}
            <div className={styles.address}>
              <h2 className={styles.h2}>Где мы и как добраться</h2>
              <div className={styles.addressGrid}>
                <div className={styles.row}>
                  <MapPin className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>Причал</span>
                    <span className={styles.rowValue}>{CONTACTS.address.line1}</span>
                  </div>
                </div>
                <div className={styles.row}>
                  <Car className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>На машине</span>
                    <span className={styles.rowValue}>
                      {CONTACTS.address.line2} · парковка бесплатная на месте
                    </span>
                  </div>
                </div>
                <div className={styles.row}>
                  <Clock className={styles.rowIcon} aria-hidden="true" />
                  <div className={styles.rowBody}>
                    <span className={styles.rowLabel}>Часы работы</span>
                    <span className={styles.rowValue}>
                      {CONTACTS.address.hours} · сезон навигации май–октябрь
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini-FAQ teaser */}
            <div className={styles.faqTeaser}>
              <div className={styles.faqHeader}>
                <h2 className={styles.h2}>Частые вопросы</h2>
                <Link href="/faq" className={styles.faqAll}>
                  Все вопросы
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <ul className={styles.faqList}>
                {FAQ_TEASER.map((item) => (
                  <li key={item.id} className={styles.faqItem}>
                    <span className={styles.faqQ}>{item.question}</span>
                    <span className={styles.faqA}>{item.answer}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal entity + bank requisites (для юрлиц) */}
            <details className={styles.legal}>
              <summary className={styles.legalSummary}>
                <Building2 className={styles.rowIcon} aria-hidden="true" />
                <span>
                  Реквизиты для юрлиц
                  <span className={styles.legalSummaryHint}>
                    {CONTACTS.legal.entity} · УНП {CONTACTS.legal.unp}
                  </span>
                </span>
              </summary>
              <div className={styles.legalBody}>
                <LegalRow
                  label="Наименование"
                  value={CONTACTS.legal.entity}
                  field="entity"
                  copied={copiedField}
                  onCopy={copy}
                />
                <LegalRow
                  label="УНП"
                  value={CONTACTS.legal.unp}
                  field="unp"
                  copied={copiedField}
                  onCopy={copy}
                />
                <LegalRow
                  label="Юр. адрес"
                  value={CONTACTS.legal.legalAddress}
                  field="legalAddress"
                  copied={copiedField}
                  onCopy={copy}
                />
                <LegalRow
                  label={`Р/с (${CONTACTS.legal.bank.currency})`}
                  value={CONTACTS.legal.bank.account}
                  field="account"
                  copied={copiedField}
                  onCopy={copy}
                />
                <LegalRow
                  label="Банк"
                  value={CONTACTS.legal.bank.name}
                  field="bankName"
                  copied={copiedField}
                  onCopy={copy}
                />
                <LegalRow
                  label="БИК"
                  value={CONTACTS.legal.bank.bic}
                  field="bic"
                  copied={copiedField}
                  onCopy={copy}
                />
                <p className={styles.legalNote}>
                  Договор и счёт — через{" "}
                  <a href={CONTACTS.email.href} className={styles.legalInlineLink}>
                    {CONTACTS.email.label}
                  </a>{" "}
                  или Telegram.
                </p>
              </div>
            </details>
          </div>

          {/* ── Right column: sticky booking ────────────────────────── */}
          <aside className={styles.bookCol}>
            <div className={styles.bookSticky}>
              <h2 className={styles.bookTitle}>Оставить заявку</h2>
              <p className={styles.bookLead}>
                Перезвоним в течение 30 минут в рабочие часы. Согласуем дату, яхту и формат.
              </p>
              <QuickBooking yacht={{ name: "На выбор" }} />
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function LegalRow({
  label,
  value,
  field,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  field: string;
  copied: string | null;
  onCopy: (value: string, field: string) => void;
}) {
  return (
    <div className={styles.legalRow}>
      <span className={styles.legalLabel}>{label}</span>
      <span className={styles.legalValue}>{value}</span>
      <button
        type="button"
        className={styles.legalCopy}
        onClick={() => onCopy(value, field)}
        aria-label={`Копировать ${label.toLowerCase()}`}
      >
        <Copy aria-hidden="true" />
        <span>{copied === field ? "Скопировано" : "Копировать"}</span>
      </button>
    </div>
  );
}

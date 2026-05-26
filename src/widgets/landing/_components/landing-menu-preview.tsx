"use client";

import { Link } from "@/i18n/navigation";
import { CONTACTS } from "@/shared/content/contacts";
import { FAQ } from "@/shared/content/faq";
import { REVIEWS } from "@/shared/content/reviews";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import type { ReactNode } from "react";
import { COVER_BY_YACHT, GALLERY, thumbUrl, type YachtSlug } from "../_data/photos";
import { servicePhoto } from "../_data/service-photos";
import styles from "./landing-menu.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

const trim = (s: string, n: number) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

type Props = { index: number; onNavigate: () => void };

// Per-section "showcase" rendered in the desktop preview pane: a compact grid
// of the real content (yachts, services, photos, prices, reviews, FAQ,
// contacts). Cards link straight to the specific item; the whole pane is
// aria-hidden (the left list is the real nav), so links are tabIndex={-1}.
export function MenuPreview({ index, onNavigate }: Props) {
  switch (index) {
    case 0: // Флот — 2×2
      return (
        <div className={styles.gridFleet}>
          {YACHTS.map((y) => (
            <Link
              key={y.slug}
              href={`/fleet/${y.slug}`}
              className={`${styles.card} ${styles.cardFleet}`}
              onClick={onNavigate}
              tabIndex={-1}
            >
              <span className={styles.cardThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl(COVER_BY_YACHT[y.slug as YachtSlug])}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                {y.badge === "flagship" && <span className={styles.cardBadge}>флагман</span>}
              </span>
              <span className={styles.cardName}>{y.name}</span>
              <span className={styles.cardMeta}>
                {TYPE_LABEL[y.type]} · до {y.capacity}
              </span>
              <span className={styles.cardPrice}>от {y.pricePerHour} BYN/ч</span>
            </Link>
          ))}
        </div>
      );
    case 1: // Услуги — 3×3
      return (
        <div className={styles.gridServices}>
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className={styles.card}
              onClick={onNavigate}
              tabIndex={-1}
            >
              <span className={styles.cardThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl(servicePhoto(s.slug).url)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className={styles.cardName}>{s.shortTitle}</span>
              <span className={styles.cardPrice}>от {s.fromPrice} BYN</span>
            </Link>
          ))}
        </div>
      );
    case 2: // Цены — 2 columns
      return (
        <div className={styles.priceCols}>
          <div className={styles.priceCol}>
            <span className={styles.priceHead}>Яхты</span>
            {YACHTS.map((y) => (
              <Link
                key={y.slug}
                href={`/fleet/${y.slug}`}
                className={styles.priceRow}
                onClick={onNavigate}
                tabIndex={-1}
              >
                <span className={styles.priceName}>{y.name}</span>
                <span className={styles.priceVal}>от {y.pricePerHour} BYN/ч</span>
              </Link>
            ))}
          </div>
          <div className={styles.priceCol}>
            <span className={styles.priceHead}>Услуги</span>
            {SERVICES.slice(0, 5).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={styles.priceRow}
                onClick={onNavigate}
                tabIndex={-1}
              >
                <span className={styles.priceName}>{s.shortTitle}</span>
                <span className={styles.priceVal}>от {s.fromPrice} BYN</span>
              </Link>
            ))}
          </div>
        </div>
      );
    case 3: // Галерея — 3×3 thumbs
      return (
        <div className={styles.gridGallery}>
          {GALLERY.slice(0, 9).map((shot) => (
            <Link
              key={shot.url}
              href="/galereya"
              className={styles.galleryCell}
              onClick={onNavigate}
              tabIndex={-1}
              aria-label={shot.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbUrl(shot.url)} alt="" loading="lazy" decoding="async" />
            </Link>
          ))}
        </div>
      );
    case 4: {
      // Отзывы — rating summary + 2 quotes
      const avg = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);
      return (
        <div className={styles.reviewsSummary}>
          <div className={styles.reviewsScore}>
            <span className={styles.reviewsStars} aria-hidden="true">
              ★★★★★
            </span>
            <span className={styles.reviewsNum}>{avg}</span>
            <span className={styles.reviewsCount}>{REVIEWS.length} отзывов</span>
          </div>
          <ul className={styles.reviewQuotes}>
            {REVIEWS.slice(0, 2).map((r) => (
              <li key={r.id} className={styles.reviewQuote}>
                «{trim(r.text, 96)}»<span className={styles.reviewAuthor}>{r.authorName}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case 5: // Вопросы — top 5
      return (
        <ul className={styles.faqList}>
          {FAQ.slice(0, 5).map((f) => (
            <li key={f.id}>
              <Link href="/faq" className={styles.faqRow} onClick={onNavigate} tabIndex={-1}>
                {f.question}
              </Link>
            </li>
          ))}
        </ul>
      );
    case 6: {
      // Контакты — 2×2 channels + address
      const channels: ReadonlyArray<{ node: ReactNode; label: string; href: string }> = [
        {
          node: (
            <svg
              className={styles.contactIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
          ),
          label: CONTACTS.phones[0].label,
          href: CONTACTS.phones[0].href,
        },
        {
          node: (
            <svg
              className={styles.contactIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21.5 4.3 18.6 19c-.2 1-.8 1.2-1.6.7l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.36-.3-.08-.5-.55-.2l-10.1 6.4-4.4-1.4c-.95-.3-.97-.95.2-1.4L20 3c.8-.3 1.5.2 1.5 1.3z" />
            </svg>
          ),
          label: CONTACTS.telegram.label,
          href: CONTACTS.telegram.href,
        },
        {
          node: (
            <svg
              className={styles.contactIcon}
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
          ),
          label: CONTACTS.instagram.label,
          href: CONTACTS.instagram.href,
        },
        {
          node: (
            <svg
              className={styles.contactIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
            </svg>
          ),
          label: "Viber",
          href: CONTACTS.viber.href,
        },
      ];
      return (
        <div className={styles.contactsBlock}>
          <div className={styles.contactsGrid}>
            {channels.map(({ node, label, href }) => (
              <a key={label} href={href} className={styles.contactCard} tabIndex={-1}>
                {node}
                <span className={styles.contactLabel}>{label}</span>
              </a>
            ))}
          </div>
          <span className={styles.contactAddress}>
            {CONTACTS.address.line1} · {CONTACTS.address.line2}
          </span>
        </div>
      );
    }
    default:
      return null;
  }
}

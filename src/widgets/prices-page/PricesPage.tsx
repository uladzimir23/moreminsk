"use client";

import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import clsx from "clsx";
import { ArrowRight, BadgeCheck, Clock, Fuel, Sailboat, Ship, type LucideIcon } from "lucide-react";
import styles from "./PricesPage.module.scss";

const TYPE_LABEL: Record<Yacht["type"], string> = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
};
const TYPE_ICON: Record<Yacht["type"], LucideIcon> = {
  sail: Sailboat,
  motor: Ship,
  "sail-motor": Sailboat,
};

const TRUST: ReadonlyArray<{ icon: LucideIcon; text: string }> = [
  { icon: BadgeCheck, text: "Капитан с лицензией" },
  { icon: Fuel, text: "Топливо в цене" },
  { icon: Clock, text: "Ответ за 30 минут" },
];

export function PricesPage() {
  const { open } = usePanel();

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Цены" }]}
          eyebrow="Цены"
          title="Цены на аренду яхт"
          accent="в Минске"
          lead="Почасовые ставки яхт — капитан и топливо уже в цене, минимум 1 час. Это ориентир: точную стоимость подтверждаем при звонке под вашу дату и состав."
          image={COVER_BY_YACHT.bravo}
          titleId="prices-title"
        />
      }
    >
      {/* Sticky in-page anchors. */}
      <nav className={styles.anchorNav} aria-label="Разделы цен">
        <a href="#fleet" className={styles.anchorLink}>
          Флот
        </a>
        <a href="#services" className={styles.anchorLink}>
          Услуги
        </a>
      </nav>

      <section id="fleet" className={styles.section}>
        <SectionHeader eyebrow="01 · Флот" title="Почасовая" accent="аренда" tone="media" framed />

        <ul className={styles.grid}>
          {YACHTS.map((y) => {
            const cover = COVER_BY_YACHT[y.slug as keyof typeof COVER_BY_YACHT];
            const TypeIcon = TYPE_ICON[y.type];
            const flagship = y.badge === "flagship";
            return (
              <li key={y.slug} className={clsx(styles.card, flagship && styles.cardFlagship)}>
                {/* Per-card blurred-photo backdrop (slow ken-burns lives on the blur). */}
                <AmbientBackdrop images={[cover]} activeIndex={0} className={styles.cardBg} />
                {flagship && <span className={styles.badge}>флагман</span>}

                <Link
                  href={`/fleet/${y.slug}`}
                  className={styles.media}
                  aria-label={`Яхта ${y.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.mediaImg}
                    src={cover}
                    alt={`Яхта ${y.name} на Минском море`}
                    loading="lazy"
                    decoding="async"
                  />
                </Link>

                <div className={styles.info}>
                  <p className={styles.specs}>
                    <TypeIcon className={styles.specIcon} aria-hidden="true" />
                    {TYPE_LABEL[y.type]} · до {y.capacity} гостей · минимум {y.minHours} ч
                  </p>
                  <h3 className={styles.name}>
                    <Link href={`/fleet/${y.slug}`} className={styles.nameLink}>
                      {y.name}
                    </Link>
                  </h3>
                  <p className={styles.priceBlock}>
                    <span className={styles.priceFrom}>от</span>
                    <span className={styles.priceValue}>{y.pricePerHour}</span>
                    <span className={styles.priceSuffix}>BYN/ч</span>
                  </p>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.book}
                      onClick={() => open("order", { yacht: y.slug })}
                    >
                      Забронировать
                    </button>
                    <Link href={`/fleet/${y.slug}`} className={styles.detail}>
                      Подробнее
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <ul className={styles.trust}>
          {TRUST.map((t) => (
            <li key={t.text} className={styles.trustItem}>
              <t.icon className={styles.trustIcon} aria-hidden="true" />
              {t.text}
            </li>
          ))}
        </ul>
      </section>

      <section id="services" className={styles.section}>
        <SectionHeader
          eyebrow="02 · Услуги"
          title="Под событие"
          accent="почасово"
          tone="media"
          framed
        />

        <ul className={styles.svcGrid}>
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className={styles.svcChip}>
                <span className={styles.svcName}>{s.shortTitle}</span>
                <span className={styles.svcPrice}>от {s.fromPrice} BYN/ч</span>
                <ArrowRight className={styles.svcArrow} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Готовы выбрать дату?</h2>
          <p className={styles.ctaLead}>
            Капитан и топливо в цене, минимум 1 час. Подтвердим свободное окно за 30 минут.
          </p>
          <button type="button" className={styles.ctaBtn} onClick={() => open("order")}>
            Забронировать
            <ArrowRight className={styles.ctaIcon} aria-hidden="true" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}

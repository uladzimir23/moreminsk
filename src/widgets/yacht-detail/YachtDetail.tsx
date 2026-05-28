"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Fuel,
  Music,
  Sailboat,
  UserRound,
  Users,
  Waves,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import styles from "./YachtDetail.module.scss";

const TYPE_LABEL: Record<Yacht["type"], string> = {
  sail: "Парусная яхта",
  motor: "Моторная яхта",
  "sail-motor": "Парусно-моторная яхта",
};

// Onboard feature label → icon. Falls back to a check for anything unmapped.
const FEATURE_ICONS: Record<string, LucideIcon> = {
  Капитан: UserRound,
  Топливо: Fuel,
  "Тиковая палуба": Sailboat,
  Аудиосистема: Music,
  "Фуршетный стол": Wine,
  "Купальная платформа": Waves,
};

export type OtherYacht = {
  slug: string;
  name: string;
  type: Yacht["type"];
  pricePerHour: number;
  cover: string;
  badge?: Yacht["badge"];
};

type Props = {
  yacht: Yacht;
  photos: ReadonlyArray<string>;
  services: ReadonlyArray<Service>;
  others: ReadonlyArray<OtherYacht>;
};

export function YachtDetail({ yacht, photos, services, others }: Props) {
  const { open } = usePanel();
  // Active gallery photo — drives the ambient wash behind the photo section.
  const [bgIdx, setBgIdx] = useState(0);

  const specs = yacht.specs;
  const specRows: Array<{ label: string; value: string }> = specs
    ? [
        { label: "Модель", value: specs.model },
        { label: "Верфь", value: specs.builder },
        { label: "Длина", value: `${specs.lengthM} м` },
        { label: "Ширина", value: `${specs.beamM} м` },
        { label: "Осадка", value: `${specs.draftM} м` },
        ...(specs.cabins ? [{ label: "Кают", value: String(specs.cabins) }] : []),
        ...(specs.berths ? [{ label: "Спальных мест", value: String(specs.berths) }] : []),
        ...(specs.sailAreaM2
          ? [{ label: "Площадь парусов", value: `${specs.sailAreaM2} м²` }]
          : []),
        ...(specs.headroomM ? [{ label: "Высота в каюте", value: `${specs.headroomM} м` }] : []),
        ...(specs.yearsBuilt ? [{ label: "Годы выпуска", value: specs.yearsBuilt }] : []),
      ]
    : [];

  const id = (suffix: string) => `yacht-${yacht.slug}-${suffix}`;

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[
            { label: "Главная", href: "/" },
            { label: "Флот", href: "/fleet" },
            { label: yacht.name },
          ]}
          eyebrow={`${TYPE_LABEL[yacht.type]}${yacht.badge === "flagship" ? " · флагман" : ""}`}
          title="Яхта"
          accent={yacht.name}
          lead={yacht.description}
          image={photos[0]}
          titleId={id("title")}
        >
          <ul className={styles.specs}>
            <li className={styles.spec}>
              <Users className={styles.specIcon} aria-hidden="true" />
              до {yacht.capacity} гостей
            </li>
            <li className={styles.spec}>
              <Clock className={styles.specIcon} aria-hidden="true" />
              мин. {yacht.minHours} ч
            </li>
            <li className={styles.specPriceWrap}>
              <span className={styles.specPrice}>от {yacht.pricePerHour} BYN</span>
              <span className={styles.specUnit}>в час</span>
            </li>
          </ul>

          <button
            type="button"
            className={styles.heroCta}
            onClick={() => open("order", { yacht: yacht.slug })}
          >
            <CalendarDays className={styles.heroCtaIcon} aria-hidden="true" />
            Посмотреть даты
          </button>
        </PageHero>
      }
    >
      {/* 01 · На борту */}
      <section className={styles.section} aria-labelledby={id("onboard")}>
        <div className={styles.inner}>
          <SectionHeader
            eyebrow="01 · На борту"
            title="В аренду входит"
            accent="всё для выхода."
            tone="media"
            id={id("onboard")}
          />
          <ul className={styles.featureGrid}>
            {yacht.features.map((f) => {
              const Icon = FEATURE_ICONS[f] ?? Check;
              return (
                <li key={f} className={styles.featureCard}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <Icon strokeWidth={1.5} />
                  </span>
                  <span className={styles.featureLabel}>{f}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 02 · Техпаспорт */}
      {specRows.length > 0 && (
        <section className={styles.section} aria-labelledby={id("specs")}>
          <div className={styles.inner}>
            <SectionHeader
              eyebrow="02 · Техпаспорт"
              title="Сухие"
              accent="цифры."
              tone="media"
              id={id("specs")}
            />
            <dl className={styles.specSheet}>
              {specRows.map((row) => (
                <div key={row.label} className={styles.specRow}>
                  <dt className={styles.specLabel}>{row.label}</dt>
                  <dd className={styles.specValue}>{row.value}</dd>
                </div>
              ))}
            </dl>
            {specs?.inferred && (
              <p className={styles.specNote}>
                * ТТХ — по модели, определённой по фото; точные цифры уточняем у владельца.
              </p>
            )}
          </div>
        </section>
      )}

      {/* 03 · Фото */}
      {photos.length > 0 && (
        <section
          className={`${styles.section} ${styles.sectionMedia}`}
          aria-labelledby={id("photos")}
        >
          <AmbientBackdrop images={photos} activeIndex={bgIdx} className={styles.sectionBg} />
          <div className={styles.inner}>
            <SectionHeader
              eyebrow="03 · Фото"
              title="Яхта в"
              accent="кадре."
              tone="media"
              id={id("photos")}
            />
            <YachtGallery
              photos={photos}
              name={yacht.name}
              zoomable
              adaptiveFrame
              onActiveChange={setBgIdx}
            />
          </div>
        </section>
      )}

      {/* 04 · Поводы */}
      {services.length > 0 && (
        <section className={styles.section} aria-labelledby={id("services")}>
          <div className={styles.inner}>
            <SectionHeader
              eyebrow="04 · Поводы"
              title="Под что"
              accent="берут."
              tone="media"
              id={id("services")}
            />
            <ul className={styles.chips}>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={styles.chip}>
                    {s.shortTitle}
                    <ArrowRight className={styles.chipIcon} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 05 · Другие яхты */}
      {others.length > 0 && (
        <section className={styles.section} aria-labelledby={id("fleet")}>
          <div className={styles.inner}>
            <SectionHeader
              eyebrow="05 · Флот"
              title="Другие"
              accent="яхты."
              tone="media"
              id={id("fleet")}
            />
            <ul className={styles.otherGrid}>
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/fleet/${o.slug}`} className={styles.otherCard}>
                    <span className={styles.otherPhoto}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={o.cover} alt={`Яхта ${o.name}`} loading="lazy" decoding="async" />
                    </span>
                    <span className={styles.otherBody}>
                      <span className={styles.otherType}>
                        {TYPE_LABEL[o.type]}
                        {o.badge === "flagship" ? " · флагман" : ""}
                      </span>
                      <span className={styles.otherName}>{o.name}</span>
                      <span className={styles.otherPrice}>от {o.pricePerHour} BYN/ч</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className={`${styles.section} ${styles.sectionMedia}`}>
        {photos.length > 0 && (
          <AmbientBackdrop images={photos} activeIndex={0} className={styles.sectionBg} />
        )}
        <div className={styles.inner}>
          <div className={styles.finalCta}>
            <h2 className={styles.finalCtaTitle}>Забронировать {yacht.name}</h2>
            <p className={styles.finalCtaLead}>
              Напишите — ответим за 30 минут, подскажем свободные окна и зафиксируем авансом 30%.
            </p>
            <button
              type="button"
              className={styles.heroCta}
              onClick={() => open("order", { yacht: yacht.slug })}
            >
              Оставить заявку
              <ArrowRight className={styles.heroCtaIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

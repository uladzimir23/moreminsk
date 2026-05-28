"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
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
import { YachtCarousel } from "./YachtCarousel";
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

// Product-card layout: name + gallery + buy-box up top, then spec sheet, what's
// included, what it's booked for (SEO), and a cross-sell carousel of the rest of
// the fleet. No editorial per-section headers — plain product-page блоки.
export function YachtDetail({ yacht, photos, services, others }: Props) {
  const { open } = usePanel();
  // Active gallery photo → drives the ambient wash behind the product hero.
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
    <article className={styles.page}>
      {/* ── Product hero: gallery + buy-box ─────────────────────────────── */}
      <section className={styles.hero} aria-labelledby={id("title")}>
        {photos.length > 0 && (
          <AmbientBackdrop images={photos} activeIndex={bgIdx} className={styles.heroBg} />
        )}
        <div className={styles.heroInner}>
          <nav className={styles.crumbs} aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href="/fleet">Флот</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{yacht.name}</span>
          </nav>

          <header className={styles.heroHead}>
            <span className={styles.type}>
              {TYPE_LABEL[yacht.type]}
              {yacht.badge === "flagship" ? " · флагман" : ""}
            </span>
            <h1 id={id("title")} className={styles.name}>
              {yacht.name}
            </h1>
          </header>

          <div className={styles.product}>
            <div className={styles.galleryCol}>
              {photos.length > 0 && (
                <YachtGallery
                  photos={photos}
                  name={yacht.name}
                  zoomable
                  adaptiveFrame
                  eager
                  onActiveChange={setBgIdx}
                />
              )}
            </div>

            <div className={styles.buyBox}>
              <p className={styles.lead}>{yacht.description}</p>

              <ul className={styles.quickSpecs}>
                <li className={styles.quickSpec}>
                  <Users className={styles.quickIcon} aria-hidden="true" />
                  до {yacht.capacity} гостей
                </li>
                <li className={styles.quickSpec}>
                  <Clock className={styles.quickIcon} aria-hidden="true" />
                  мин. {yacht.minHours} ч
                </li>
              </ul>

              <div className={styles.priceRow}>
                <span className={styles.priceFrom}>от</span>
                <span className={styles.priceValue}>{yacht.pricePerHour}</span>
                <span className={styles.priceUnit}>BYN / час</span>
              </div>

              <button
                type="button"
                className={styles.cta}
                onClick={() => open("order", { yacht: yacht.slug })}
              >
                <CalendarDays className={styles.ctaIcon} aria-hidden="true" />
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Техпаспорт ──────────────────────────────────────────────────── */}
      {specRows.length > 0 && (
        <section className={styles.block} aria-labelledby={id("specs")}>
          <div className={styles.blockInner}>
            <h2 id={id("specs")} className={styles.blockTitle}>
              Технический паспорт
            </h2>
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

      {/* ── Что включено ────────────────────────────────────────────────── */}
      <section className={styles.block} aria-labelledby={id("included")}>
        <div className={styles.blockInner}>
          <h2 id={id("included")} className={styles.blockTitle}>
            Что включено
          </h2>
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

      {/* ── Под что берут (SEO) ─────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className={styles.block} aria-labelledby={id("services")}>
          <div className={styles.blockInner}>
            <h2 id={id("services")} className={styles.blockTitle}>
              Под что берут
            </h2>
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

      {/* ── Другие яхты (cross-sell carousel) ───────────────────────────── */}
      {others.length > 0 && (
        <section className={styles.block} aria-labelledby={id("fleet")}>
          <div className={styles.blockInner}>
            <h2 id={id("fleet")} className={styles.blockTitle}>
              Другие яхты
            </h2>
          </div>
          <YachtCarousel items={others} />
        </section>
      )}
    </article>
  );
}

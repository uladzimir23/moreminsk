"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import clsx from "clsx";
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
import { useEffect, useRef, useState } from "react";
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

// Product-card layout. Desktop: scrolling content (gallery → description → spec
// sheet → occasions) on the left, a sticky booking card on the right. Mobile:
// single column (gallery → booking → details) + a docked quick-book bar.
export function YachtDetail({ yacht, photos, services, others }: Props) {
  const { open } = usePanel();
  // Active gallery photo → drives the ambient wash behind the product area.
  const [bgIdx, setBgIdx] = useState(0);
  // Quick-book bar docks once the product area's name/CTA scroll above the
  // header line (mobile only — desktop keeps the sticky booking card visible).
  const heroRef = useRef<HTMLElement>(null);
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--landing-header-h"),
        ) || 56;
      const r = hero.getBoundingClientRect();
      const show = r.top <= -120 && r.bottom > headerH + 120;
      setDocked((v) => (v === show ? v : show));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
      {/* Quick-book bar — dup name · price · CTA, docks after the hero (mobile). */}
      <div className={clsx(styles.stickyBar, docked && styles.stickyBarDocked)}>
        <div className={styles.stickyInfo}>
          <span className={styles.stickyName}>{yacht.name}</span>
          <span className={styles.stickyPrice}>от {yacht.pricePerHour} BYN/ч</span>
        </div>
        <button
          type="button"
          className={styles.stickyBook}
          onClick={() => open("order", { yacht: yacht.slug })}
        >
          Забронировать
        </button>
      </div>

      <section className={styles.product} ref={heroRef} aria-labelledby={id("title")}>
        <div className={styles.bgClip} aria-hidden="true">
          {photos.length > 0 && (
            <AmbientBackdrop images={photos} activeIndex={bgIdx} className={styles.heroBg} />
          )}
        </div>

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

          <div className={styles.grid}>
            {/* Left col, row 1 — gallery */}
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

            {/* Right col — sticky booking card */}
            <aside className={styles.bookCol}>
              <div className={styles.bookCard}>
                <div className={styles.priceRow}>
                  <span className={styles.priceFrom}>от</span>
                  <span className={styles.priceValue}>{yacht.pricePerHour}</span>
                  <span className={styles.priceUnit}>BYN / час</span>
                </div>

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

                <button
                  type="button"
                  className={styles.cta}
                  onClick={() => open("order", { yacht: yacht.slug })}
                >
                  <CalendarDays className={styles.ctaIcon} aria-hidden="true" />
                  Забронировать
                </button>

                <p className={styles.bookNote}>Капитан и топливо в цене · ответим за 30 минут</p>

                <div className={styles.included}>
                  <span className={styles.includedLabel}>В стоимости</span>
                  <ul className={styles.badges}>
                    {yacht.features.map((f) => {
                      const Icon = FEATURE_ICONS[f] ?? Check;
                      return (
                        <li key={f} className={styles.badge}>
                          <Icon className={styles.badgeIcon} aria-hidden="true" />
                          {f}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Left col, row 2 — description + spec sheet + occasions */}
            <div className={styles.details}>
              <p className={styles.lead}>{yacht.description}</p>

              {specRows.length > 0 && (
                <section className={styles.detailBlock} aria-labelledby={id("specs")}>
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
                </section>
              )}

              {services.length > 0 && (
                <section className={styles.detailBlock} aria-labelledby={id("services")}>
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
                </section>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Другие яхты — full-width cross-sell carousel */}
      {others.length > 0 && (
        <section className={styles.fleetSection} aria-labelledby={id("fleet")}>
          <div className={styles.fleetHead}>
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

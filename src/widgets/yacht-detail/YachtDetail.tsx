"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { BookingForm } from "@/features/booking/BookingForm";
import { useBookingStore } from "@/features/booking/model/store";
import { Link } from "@/i18n/navigation";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import clsx from "clsx";
import {
  ArrowRight,
  Check,
  Fuel,
  Music,
  Sailboat,
  UserRound,
  Waves,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./YachtDetail.module.scss";

const TYPE_LABEL: Record<Yacht["type"], string> = {
  sail: "Парусная яхта",
  motor: "Моторная яхта",
  "sail-motor": "Парусно-моторная яхта",
};

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

// Product-card layout, 50/50 on desktop. Left: gallery → description → spec
// sheet → occasions → rest-of-fleet catalog (scrolls). Right: a sticky booking
// widget — the full <BookingForm/> wizard (date/time → contact → summary),
// pre-seeded with this yacht. Mobile: one column (gallery → booking → details).
export function YachtDetail({ yacht, photos, services, others }: Props) {
  const [bgIdx, setBgIdx] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const hydrate = useBookingStore((s) => s.hydrateFromPayload);

  // Seed the inline booking wizard with this yacht (jumps past Step 1).
  useEffect(() => {
    hydrate({ yachtSlug: yacht.slug, source: "inline-form" }, "inline-form");
  }, [hydrate, yacht.slug]);

  // Mobile quick-book bar — docks while the product area is in view.
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
      const show = r.top <= -160 && r.bottom > headerH + 160;
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

  const scrollToBook = () =>
    bookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

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
      {/* Mobile quick-book bar — scrolls to the inline widget. */}
      <div className={clsx(styles.stickyBar, docked && styles.stickyBarDocked)}>
        <div className={styles.stickyInfo}>
          <span className={styles.stickyName}>{yacht.name}</span>
          <span className={styles.stickyPrice}>от {yacht.pricePerHour} BYN/ч</span>
        </div>
        <button type="button" className={styles.stickyBook} onClick={scrollToBook}>
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

            {/* Right col — sticky booking widget */}
            <aside className={styles.bookCol} ref={bookRef}>
              <div className={styles.bookCard}>
                <div className={styles.bookHead}>
                  <span className={styles.bookEyebrow}>Бронирование {yacht.name}</span>
                  <span className={styles.priceRow}>
                    <span className={styles.priceFrom}>от</span>
                    <span className={styles.priceValue}>{yacht.pricePerHour}</span>
                    <span className={styles.priceUnit}>BYN / час</span>
                  </span>
                </div>
                <BookingForm />
              </div>
            </aside>

            {/* Left col, row 2 — description, badges, specs, occasions, fleet */}
            <div className={styles.details}>
              <p className={styles.lead}>{yacht.description}</p>

              <ul className={styles.badges} aria-label="В стоимости">
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

              {others.length > 0 && (
                <section className={styles.detailBlock} aria-labelledby={id("fleet")}>
                  <h2 id={id("fleet")} className={styles.blockTitle}>
                    Другие яхты
                  </h2>
                  <ul className={styles.otherList}>
                    {others.map((o) => (
                      <li key={o.slug}>
                        <Link href={`/fleet/${o.slug}`} className={styles.otherCard}>
                          <span className={styles.otherPhoto}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={o.cover}
                              alt={`Яхта ${o.name}`}
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                          <span className={styles.otherBody}>
                            <span className={styles.otherType}>
                              {TYPE_LABEL[o.type]}
                              {o.badge === "flagship" ? " · флагман" : ""}
                            </span>
                            <span className={styles.otherName}>{o.name}</span>
                            <span className={styles.otherPrice}>от {o.pricePerHour} BYN/ч</span>
                          </span>
                          <ArrowRight className={styles.otherArrow} aria-hidden="true" />
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
    </article>
  );
}

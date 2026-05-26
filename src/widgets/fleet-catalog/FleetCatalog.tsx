"use client";

import { Link } from "@/i18n/navigation";
import { YACHTS } from "@/shared/content/yachts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { PHOTOS_BY_YACHT, type YachtSlug } from "@/widgets/landing/_data/photos";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import styles from "./FleetCatalog.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

// Fleet catalog — a stacked showcase (Lora-italic names, mono specs, accent
// CTA) laid out as one full-width block per yacht, photo and info alternating
// sides. Theme-aware: white/paper in the light theme, dark in the dark theme.
export function FleetCatalog() {
  const { open } = usePanel();

  return (
    <section className={styles.root} aria-labelledby="fleet-catalog-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>Флот</p>
        <h1 id="fleet-catalog-title" className={styles.title}>
          Четыре яхты — <span className={styles.accent}>выбирайте настроение.</span>
        </h1>
        <p className={styles.lead}>
          Три парусные и одна моторная, от 2 до 10 гостей. Капитан и топливо в цене.
        </p>
      </div>

      <div className={styles.list}>
        {YACHTS.map((yacht, i) => {
          const cover = PHOTOS_BY_YACHT[yacht.slug as YachtSlug]?.[0];
          return (
            <article
              key={yacht.slug}
              className={clsx(styles.row, i % 2 === 1 && styles.rowReverse)}
            >
              <Link
                href={`/fleet/${yacht.slug}`}
                className={styles.media}
                aria-label={`Открыть страницу яхты ${yacht.name}`}
              >
                {cover && (
                  <>
                    {/* Blurred cover fills the frame; the crisp photo sits on
                        top contained (full height, never cropped). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.mediaBg}
                      src={cover}
                      alt=""
                      aria-hidden="true"
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.mediaPhoto}
                      src={cover}
                      alt={`Яхта ${yacht.name} на Минском море`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </>
                )}
                {yacht.badge === "flagship" && <span className={styles.badge}>флагман</span>}
              </Link>

              <div className={styles.info}>
                <p className={styles.specs}>
                  {TYPE_LABEL[yacht.type]} · до {yacht.capacity} гостей · мин. {yacht.minHours} ч
                </p>
                <h2 className={styles.yachtName}>
                  <Link href={`/fleet/${yacht.slug}`} className={styles.nameLink}>
                    {yacht.name}
                  </Link>
                </h2>
                <p className={styles.desc}>{yacht.description}</p>

                <ul className={styles.features}>
                  {yacht.features.map((f) => (
                    <li key={f} className={styles.feature}>
                      <span className={styles.featureDot} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>от</span>
                  <span className={styles.priceValue}>{yacht.pricePerHour}</span>
                  <span className={styles.priceSuffix}>BYN/ч</span>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.cta}
                    onClick={() => open("order", { yacht: yacht.slug })}
                  >
                    Забронировать
                    <ArrowRight className={styles.ctaIcon} aria-hidden="true" />
                  </button>
                  <Link href={`/fleet/${yacht.slug}`} className={styles.detailLink}>
                    Подробнее о яхте
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import styles from "./FleetCatalog.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

const INTERVAL = 3800;
const MAX_SHOTS = 5;

// One catalog card as an atmospheric «now-playing» panel (like the home fleet
// showcase): the active yacht photo is a heavily-blurred backdrop filling the
// whole card behind a dark scrim, the crisp photo (letterboxed) on one side,
// light-on-image info on the other. Photos auto-rotate and the backdrop follows
// them; rotation pauses while the card is hovered; reduced-motion shows frame 1.
export function FleetCard({
  yacht,
  photos,
  reverse,
  eager = false,
}: {
  yacht: Yacht;
  photos: ReadonlyArray<string>;
  reverse: boolean;
  eager?: boolean;
}) {
  const { open } = usePanel();
  const shots = photos.slice(0, MAX_SHOTS);
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (shots.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setActive((i) => (i + 1) % shots.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [shots.length]);

  // Manual flip via arrows / dots. preventDefault + stopPropagation so the click
  // doesn't bubble to the photo's <Link> (navigate); pauses auto-rotation.
  const step = (dir: number) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    paused.current = true;
    setActive((i) => (i + dir + shots.length) % shots.length);
  };
  const pick = (idx: number) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    paused.current = true;
    setActive(idx);
  };

  return (
    <article
      className={clsx(styles.row, reverse && styles.rowReverse)}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      {/* Blurred backdrop of the active photo, behind everything (follows rotation). */}
      <div className={styles.rowBg} aria-hidden="true">
        {shots.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`bg-${src}`}
            className={clsx(styles.rowBgImg, styles.fade, i === active && styles.fadeActive)}
            src={src}
            alt=""
            loading={eager && i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
        <span className={styles.rowWash} />
      </div>

      <div className={styles.media}>
        <Link
          href={`/fleet/${yacht.slug}`}
          className={styles.mediaLink}
          aria-label={`Открыть страницу яхты ${yacht.name}`}
        >
          {shots.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`ph-${src}`}
              className={clsx(styles.mediaPhoto, styles.fade, i === active && styles.fadeActive)}
              src={src}
              alt={i === active ? `Яхта ${yacht.name} на Минском море` : ""}
              aria-hidden={i === active ? undefined : true}
              loading={eager && i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </Link>

        {shots.length > 1 && (
          <>
            <button
              type="button"
              className={styles.navPrev}
              onClick={step(-1)}
              aria-label="Предыдущее фото"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.navNext}
              onClick={step(1)}
              aria-label="Следующее фото"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <span className={styles.dots}>
              {shots.map((src, i) => (
                <button
                  type="button"
                  key={`dot-${src}`}
                  className={clsx(styles.dot, i === active && styles.dotActive)}
                  onClick={pick(i)}
                  aria-label={`Фото ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                />
              ))}
            </span>
          </>
        )}
        {yacht.badge === "flagship" && <span className={styles.badge}>флагман</span>}
      </div>

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
}

"use client";

import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import styles from "./FleetCatalog.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

// One catalog card = the home «now-playing» structure per yacht: a theme-aware
// ambient backdrop of the active photo fills the card, the shared photo gallery
// (frame + thumbs + arrows, no zoom) on one side, info on the other. Reuses
// <AmbientBackdrop> + <YachtGallery> — no bespoke gallery here.
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
  // Active photo index, fed by the gallery so the ambient backdrop follows it.
  const [bgIdx, setBgIdx] = useState(0);

  return (
    <article className={clsx(styles.row, reverse && styles.rowReverse)}>
      <AmbientBackdrop images={photos} activeIndex={bgIdx} className={styles.cardBg} />

      <div className={styles.gallerySlot}>
        {yacht.badge === "flagship" && <span className={styles.badge}>флагман</span>}
        <YachtGallery photos={photos} name={yacht.name} eager={eager} onActiveChange={setBgIdx} />
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

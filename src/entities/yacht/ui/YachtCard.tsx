"use client";

import type { Yacht } from "@/entities/yacht/model/types";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { Accent } from "@/shared/ui/accent/Accent";
import { ArrowRight, Sailboat, Users } from "lucide-react";
import styles from "./YachtCard.module.scss";

const TYPE_LABEL: Record<Yacht["type"], string> = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
};

const BADGE_LABEL: Record<NonNullable<Yacht["badge"]>, string> = {
  flagship: "Флагман",
  new: "Новинка",
};

type Props = { yacht: Yacht };

export function YachtCard({ yacht }: Props) {
  const { open } = usePanel();

  return (
    <article className={styles.root} aria-labelledby={`yacht-${yacht.slug}`}>
      <div className={styles.media} aria-hidden="true">
        <Sailboat className={styles.mediaIcon} />
        {yacht.badge && <span className={styles.badge}>{BADGE_LABEL[yacht.badge]}</span>}
      </div>

      <div className={styles.body}>
        <header className={styles.header}>
          <h3 id={`yacht-${yacht.slug}`} className={styles.name}>
            <Accent>{yacht.name}</Accent>
          </h3>
          <p className={styles.type}>{TYPE_LABEL[yacht.type]}</p>
        </header>

        <ul className={styles.specs}>
          <li className={styles.spec}>
            <Users className={styles.specIcon} aria-hidden="true" />
            <span>до {yacht.capacity} человек</span>
          </li>
          {yacht.lengthMeters && (
            <li className={styles.spec}>
              <span aria-hidden="true">↔</span>
              <span>{yacht.lengthMeters} м</span>
            </li>
          )}
        </ul>

        <p className={styles.description}>{yacht.description}</p>

        <footer className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>от</span>
            <span className={styles.priceValue}>{yacht.pricePerHour}</span>
            <span className={styles.priceSuffix}>BYN/час</span>
          </div>
          <button
            type="button"
            onClick={() => open("order", { yacht: yacht.slug })}
            className={styles.cta}
            aria-label={`Забронировать яхту ${yacht.name}`}
          >
            Забронировать
            <ArrowRight className={styles.ctaIcon} aria-hidden="true" />
          </button>
        </footer>
      </div>
    </article>
  );
}

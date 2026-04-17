"use client";

import { YACHTS } from "@/shared/content/yachts";
import { Shuffle } from "lucide-react";
import formStyles from "../../BookingForm.module.scss";
import { useBookingStore } from "../../model/store";
import type { YachtSlug } from "../../model/types";
import { WizardNav } from "../WizardNav";
import styles from "./YachtStep.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

export function YachtStep() {
  const { draft, patch, goNext } = useBookingStore();
  const selected = draft.yachtSlug;

  const choose = (slug: YachtSlug | "any") => {
    patch({ yachtSlug: slug });
  };

  const canAdvance = selected !== undefined;

  return (
    <form
      className={styles.root}
      onSubmit={(e) => {
        e.preventDefault();
        if (canAdvance) goNext();
      }}
    >
      <h2 className={formStyles.stepTitle}>Выберите яхту</h2>
      <p className={formStyles.stepLead}>
        Выберите любую из четырёх яхт или «Без предпочтений» — менеджер подберёт под дату и бюджет.
      </p>

      <ul className={styles.list}>
        {YACHTS.map((y) => {
          const isActive = selected === y.slug;
          return (
            <li key={y.slug}>
              <button
                type="button"
                className={`${styles.option} ${isActive ? styles.optionSelected : ""}`}
                onClick={() => choose(y.slug as YachtSlug)}
                aria-pressed={isActive}
              >
                <span className={styles.icon} aria-hidden="true">
                  {y.name.charAt(0)}
                </span>
                <span className={styles.meta}>
                  <span className={styles.name}>{y.name}</span>
                  <span className={styles.spec}>
                    {TYPE_LABEL[y.type]} · до {y.capacity} чел
                  </span>
                </span>
                <span className={styles.price}>от {y.pricePerHour} BYN/ч</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            className={`${styles.option} ${selected === "any" ? styles.optionSelected : ""}`}
            onClick={() => choose("any")}
            aria-pressed={selected === "any"}
          >
            <span className={styles.icon} aria-hidden="true">
              <Shuffle size={18} />
            </span>
            <span className={styles.meta}>
              <span className={styles.name}>Без предпочтений</span>
              <span className={styles.spec}>Подберём под дату и бюджет</span>
            </span>
          </button>
        </li>
      </ul>

      <WizardNav showBack={false} nextType="submit" nextDisabled={!canAdvance} />
    </form>
  );
}

"use client";

import { TIME_SLOTS } from "../model/durations";
import styles from "./ChipGroup.module.scss";

type Props = {
  value?: string;
  onChange: (slot: string) => void;
};

export function TimeSlotPicker({ value, onChange }: Props) {
  return (
    <div>
      <span className={styles.fieldLabel}>Время</span>
      <div className={styles.chips} role="radiogroup" aria-label="Время">
        {TIME_SLOTS.map((s) => {
          const isActive = value === s.value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`${styles.chip} ${isActive ? styles.chipSelected : ""}`}
              onClick={() => onChange(s.value)}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

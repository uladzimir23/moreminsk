"use client";

import { DURATION_OPTIONS, isSameDuration } from "../model/durations";
import type { DurationOption } from "../model/types";
import styles from "./ChipGroup.module.scss";

type Props = {
  value?: DurationOption;
  onChange: (value: DurationOption) => void;
};

export function DurationPicker({ value, onChange }: Props) {
  const selectedNote = value && DURATION_OPTIONS.find((o) => isSameDuration(o.value, value))?.note;

  return (
    <div>
      <span className={styles.fieldLabel}>Длительность</span>
      <div className={styles.chips} role="radiogroup" aria-label="Длительность">
        {DURATION_OPTIONS.map((opt) => {
          const isActive = value ? isSameDuration(opt.value, value) : false;
          const Icon = opt.icon;
          return (
            <button
              key={opt.label}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`${styles.chip} ${isActive ? styles.chipSelected : ""}`}
              onClick={() => onChange(opt.value)}
            >
              <Icon size={14} aria-hidden="true" />
              {opt.label}
            </button>
          );
        })}
      </div>
      {selectedNote && <p className={styles.note}>{selectedNote}</p>}
    </div>
  );
}

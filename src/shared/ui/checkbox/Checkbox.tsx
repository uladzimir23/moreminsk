"use client";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import styles from "./Checkbox.module.scss";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  children: React.ReactNode;
};

// Editorial checkbox on Radix headless — a square that fills with the accent
// when checked. Theme-aware.
export function Checkbox({ checked, onCheckedChange, id, children }: Props) {
  return (
    <label className={styles.root}>
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        className={styles.box}
      >
        <RadixCheckbox.Indicator className={styles.indicator}>
          <Check size={13} strokeWidth={3} aria-hidden="true" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <span className={styles.label}>{children}</span>
    </label>
  );
}

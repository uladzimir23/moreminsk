"use client";

import type { ThemePreference } from "@/shared/lib/theme/types";
import { useTheme } from "@/shared/lib/theme/useTheme";
import clsx from "clsx";
import { Monitor, Moon, Sun } from "lucide-react";
import styles from "./ThemeToggle.module.scss";

const OPTIONS: ReadonlyArray<{ value: ThemePreference; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Светлая тема", Icon: Sun },
  { value: "dark", label: "Тёмная тема", Icon: Moon },
  { value: "system", label: "Системная тема", Icon: Monitor },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className={styles.root} role="group" aria-label="Переключатель темы">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
          className={clsx(styles.option, preference === value && styles.optionActive)}
        >
          <Icon className={styles.icon} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

"use client";

import { useTheme } from "@/shared/lib/theme/useTheme";
import { Tooltip } from "@/shared/ui/tooltip/Tooltip";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import styles from "./landing-controls.module.scss";

// Theme toggle (light ↔ dark), styled for the editorial header. Colours ride on
// the header's --hdr-fg so it stays legible over the dark hero (white) and flips
// to dark text once the bar is frosted / the menu is open. Rendered both in the
// desktop header actions and the burger footer. (Locale switch removed.)
export function LandingControls({ className }: { className?: string }) {
  const { theme, setPreference } = useTheme();

  return (
    <div className={clsx(styles.root, className)}>
      <Tooltip content={theme === "dark" ? "Светлая тема" : "Тёмная тема"}>
        <button
          type="button"
          className={styles.theme}
          onClick={() => setPreference(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
        >
          {theme === "dark" ? (
            <Sun className={styles.icon} aria-hidden="true" />
          ) : (
            <Moon className={styles.icon} aria-hidden="true" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}

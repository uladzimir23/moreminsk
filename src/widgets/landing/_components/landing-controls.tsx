"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { useTheme } from "@/shared/lib/theme/useTheme";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useLocale } from "next-intl";
import styles from "./landing-controls.module.scss";

// Theme toggle (light ↔ dark) + RU/EN locale switch, styled for the editorial
// header. Colours ride on the header's --hdr-fg so the cluster stays legible
// over the dark hero (white) and flips to dark text once the bar is frosted /
// the menu is open. Reuses the shared theme + i18n logic, not their app-style
// pills. Rendered both in the desktop header actions and the burger footer.
export function LandingControls({ className }: { className?: string }) {
  const { theme, setPreference } = useTheme();
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className={clsx(styles.root, className)}>
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

      <span className={styles.sep} aria-hidden="true" />

      <div className={styles.locales} role="group" aria-label="Язык">
        {routing.locales.map((loc) => (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            className={clsx(styles.locale, loc === activeLocale && styles.localeActive)}
            aria-current={loc === activeLocale ? "true" : undefined}
          >
            {loc.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
}

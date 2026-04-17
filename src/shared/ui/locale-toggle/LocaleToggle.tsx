"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import clsx from "clsx";
import { useLocale } from "next-intl";
import styles from "./LocaleToggle.module.scss";

const LABELS: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
};

export function LocaleToggle() {
  const active = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className={styles.root} role="group" aria-label="Переключатель языка">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          aria-label={`Switch to ${LABELS[locale]}`}
          aria-current={locale === active ? "true" : undefined}
          className={clsx(styles.option, locale === active && styles.optionActive)}
        >
          {LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}

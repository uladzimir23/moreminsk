"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { LocaleToggle } from "@/shared/ui/locale-toggle/LocaleToggle";
import { ThemeToggle } from "@/shared/ui/theme-toggle/ThemeToggle";
import clsx from "clsx";
import { Sailboat } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./Appbar.module.scss";

const NAV = [
  { href: "/", key: "home" },
  { href: "/fleet", key: "fleet" },
  { href: "/services", key: "services" },
  { href: "/contacts", key: "contacts" },
] as const;

const NAV_LABELS_RU: Record<(typeof NAV)[number]["key"], string> = {
  home: "Главная",
  fleet: "Флот",
  services: "Услуги",
  contacts: "Контакты",
};

export function Appbar() {
  const pathname = usePathname();
  const { open } = usePanel();
  // Translations slot — falls back to RU labels until messages/*.json carry
  // a `nav.*` namespace (next-intl warns + uses key, so we render RU directly).
  const t = useTranslations();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.root}>
      <Link href="/" className={styles.brand} aria-label="Море Minsk — на главную">
        <Sailboat className={styles.brandMark} aria-hidden="true" />
        <span className={styles.brandText}>
          {t.has("common.siteTitle") ? t("common.siteTitle") : "Море Minsk"}
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Основная навигация">
        {NAV.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={clsx(styles.navLink, isActive(href) && styles.navLinkActive)}
          >
            {NAV_LABELS_RU[key]}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <ThemeToggle />
        <LocaleToggle />
        <button type="button" onClick={() => open("order")} className={styles.cta}>
          Заказать
        </button>
      </div>
    </header>
  );
}

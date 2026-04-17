"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import clsx from "clsx";
import { Home, Menu, Plus, Sailboat, Sparkles } from "lucide-react";
import styles from "./BottomNav.module.scss";

type NavItem = {
  key: "home" | "fleet" | "services" | "more";
  href?: "/" | "/fleet" | "/services";
  panel?: "more";
  label: string;
  Icon: typeof Home;
};

const ITEMS: ReadonlyArray<NavItem> = [
  { key: "home", href: "/", label: "Главная", Icon: Home },
  { key: "fleet", href: "/fleet", label: "Флот", Icon: Sailboat },
  { key: "services", href: "/services", label: "Услуги", Icon: Sparkles },
  { key: "more", panel: "more", label: "Ещё", Icon: Menu },
];

export function BottomNav() {
  const pathname = usePathname();
  const { open } = usePanel();

  const isActive = (href?: string) =>
    !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Insert the center «Заказать» CTA between items 2 and 3 so the grid stays 5-col.
  const [left, right] = [ITEMS.slice(0, 2), ITEMS.slice(2)];

  return (
    <nav className={styles.root} aria-label="Нижняя навигация">
      {left.map((item) => renderItem(item, isActive(item.href), open))}

      <button
        type="button"
        onClick={() => open("order")}
        className={styles.cta}
        aria-label="Заказать"
      >
        <Plus className={styles.ctaIcon} aria-hidden="true" />
        <span className={styles.ctaLabel}>Заказать</span>
      </button>

      {right.map((item) => renderItem(item, isActive(item.href), open))}
    </nav>
  );
}

function renderItem(item: NavItem, active: boolean, open: ReturnType<typeof usePanel>["open"]) {
  const { key, href, panel, label, Icon } = item;
  const className = clsx(styles.item, active && styles.itemActive);

  if (href) {
    return (
      <Link key={key} href={href} aria-current={active ? "page" : undefined} className={className}>
        <Icon className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </Link>
    );
  }

  return (
    <button key={key} type="button" onClick={() => panel && open(panel)} className={className}>
      <Icon className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </button>
  );
}

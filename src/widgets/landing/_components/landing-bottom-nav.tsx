"use client";

import clsx from "clsx";
import { Home, MapPin, Plus, Sailboat, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./landing-bottom-nav.module.scss";

// Mobile-only bottom navigation for the single-page landing. Anchors scroll
// to sections; the centre «Заказать» is the primary CTA. A lightweight
// scroll-spy highlights whichever section is currently in view. Hidden on
// desktop (the top header carries the nav there).

type Item = {
  key: string;
  target: string; // element id (without #), or "top"
  label: string;
  Icon: typeof Home;
};

const LEFT: Item[] = [
  { key: "home", target: "top", label: "Главная", Icon: Home },
  { key: "fleet", target: "fleet", label: "Флот", Icon: Sailboat },
];
const RIGHT: Item[] = [
  { key: "services", target: "services", label: "Услуги", Icon: Sparkles },
  { key: "contact", target: "contact", label: "Контакты", Icon: MapPin },
];
const SPY = ["fleet", "services", "contact"]; // top→home falls out by default

export function LandingBottomNav() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      let current = "home";
      for (const id of SPY) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderItem = (item: Item) => (
    <a
      key={item.key}
      href={item.target === "top" ? "#top" : `#${item.target}`}
      onClick={go(item.target)}
      aria-current={active === item.key || active === item.target ? "page" : undefined}
      className={clsx(
        styles.item,
        (active === item.key || active === item.target) && styles.itemActive,
      )}
    >
      <item.Icon className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>{item.label}</span>
    </a>
  );

  return (
    <nav className={styles.root} aria-label="Нижняя навигация">
      {LEFT.map(renderItem)}

      <a href="#booking" onClick={go("booking")} className={styles.cta} aria-label="Заказать">
        <Plus className={styles.ctaIcon} aria-hidden="true" />
        <span className={styles.ctaLabel}>Заказать</span>
      </a>

      {RIGHT.map(renderItem)}
    </nav>
  );
}

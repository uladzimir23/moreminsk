"use client";

import { Logo } from "@/shared/ui/logo/Logo";
import { useEffect, useState } from "react";
import styles from "./landing-header.module.scss";

const NAV = [
  { href: "#fleet", label: "Флот" },
  { href: "#services", label: "Услуги" },
  { href: "#gallery", label: "Галерея" },
  { href: "#contact", label: "Контакты" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <a href="#top" className={styles.brand} aria-label="Минское море — на главную">
          <Logo />
        </a>

        <nav className={styles.nav} aria-label="Разделы">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="tel:+375296953636" className={styles.phone}>
            +375&nbsp;29&nbsp;695&nbsp;36&nbsp;36
          </a>
          <a href="#booking" className={styles.cta}>
            Забронировать
          </a>
        </div>
      </div>
    </header>
  );
}

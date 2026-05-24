"use client";

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
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <a href="#top" className={styles.brand}>
        <svg
          className={styles.brandMark}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2 L12 17" />
          <path d="M12 4 L5 15 L12 15 Z" fill="currentColor" stroke="none" />
          <path d="M3 18 L21 18" />
          <path d="M5 18 Q12 22 19 18" />
        </svg>
        Море&nbsp;<span className={styles.brandAccent}>Minsk</span>
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
          +375 29 695 36 36
        </a>
        <a href="#booking" className={styles.cta}>
          Забронировать
        </a>
      </div>
    </header>
  );
}

"use client";

import { Logo } from "@/shared/ui/logo/Logo";
import { useEffect, useRef, useState } from "react";
import styles from "./landing-header.module.scss";
import { LandingMenu } from "./landing-menu";

const NAV = [
  { href: "#fleet", label: "Флот" },
  { href: "#services", label: "Услуги" },
  { href: "#gallery", label: "Галерея" },
  { href: "#contact", label: "Контакты" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the real header height as --landing-header-h so the sticky fleet
  // tabs (and anything else) pin flush under it instead of guessing the value.
  // ResizeObserver re-measures when the bar shrinks on scroll or text reflows.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--landing-header-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
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
          {/* Mobile-only quick jump to the fleet (desktop has it in the nav). */}
          <a href="#fleet" className={styles.fleetBtn}>
            Яхты
          </a>
          <a href="tel:+375296953636" className={styles.phone}>
            +375&nbsp;29&nbsp;695&nbsp;36&nbsp;36
          </a>
          <div className={styles.socials}>
            <a
              className={styles.social}
              href="https://t.me/moreminsk"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.5 4.3 18.6 19c-.2 1-.8 1.2-1.6.7l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.36-.3-.08-.5-.55-.2l-10.1 6.4-4.4-1.4c-.95-.3-.97-.95.2-1.4L20 3c.8-.3 1.5.2 1.5 1.3z" />
              </svg>
            </a>
            <a
              className={styles.social}
              href="https://instagram.com/moreminsk.by"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
          <a href="#booking" className={styles.cta}>
            Забронировать
          </a>
          <LandingMenu />
        </div>
      </div>
    </header>
  );
}

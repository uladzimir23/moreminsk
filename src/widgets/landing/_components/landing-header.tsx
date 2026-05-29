"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { Logo } from "@/shared/ui/logo/Logo";
import { useEffect, useRef, useState } from "react";
import { LandingControls } from "./landing-controls";
import styles from "./landing-header.module.scss";
import { LandingMenu } from "./landing-menu";
import { SocialLink } from "./social-link";

// «Яхты» pill leads the bar; «Главная» is the first text link right after it.
const NAV = [
  { href: "/", label: "Главная" },
  { href: "/fleet", label: "Флот" },
  { href: "/services", label: "Услуги" },
  { href: "/ceny", label: "Цены" },
  { href: "/galereya", label: "Галерея" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
  { href: "/sertifikaty", label: "🎁 Сертификаты" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { open } = usePanel();

  // Only the home page has the dark cinematic hero behind the header, so the
  // white-over-image → frosted-dark flip belongs there. Everywhere else the
  // header is permanently in the frosted «paper + dark text» state (readable on
  // both the light page and the dark fleet section).
  const isHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the real header height as --landing-header-h so the sticky fleet
  // tabs (and anything else) pin flush under it instead of guessing the value.
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

  const framed = scrolled || !isHome;

  return (
    <header ref={headerRef} className={`${styles.header} ${framed ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="Минское море — на главную">
          <Logo />
        </Link>

        {/* «Яхты» pill leads the bar (first interactive item after the brand). */}
        <Link href="/fleet" className={styles.fleetBtn} aria-label="Смотреть флот">
          {/* Yacht sails across behind the label on hover — echoes the logo
              mark. Sits behind the text; the label swaps Яхты → Флот. */}
          <span className={styles.fleetSail} aria-hidden="true">
            <svg viewBox="0 0 28 28" fill="none" focusable="false">
              <path d="M13 5 L13 18 L5 18 Z" fill="currentColor" />
              <path d="M15 9 L15 18 L21.5 18 Z" fill="currentColor" opacity="0.55" />
              <path
                d="M3 21 q5 2 10 0 t10 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className={styles.fleetWords}>
            <span className={styles.fleetWordRest}>Яхты</span>
            <span className={styles.fleetWordHover} aria-hidden="true">
              Флот
            </span>
          </span>
          <svg
            className={styles.fleetArrow}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        <nav className={styles.nav} aria-label="Разделы">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {/* Phone, socials and the theme toggle show inline only at ≥xl, where
              the full bar fits; below that they collapse into the burger menu
              (which is present on every breakpoint). */}
          <a href="tel:+375296953636" className={styles.phone}>
            +375&nbsp;29&nbsp;695&nbsp;36&nbsp;36
          </a>
          <div className={styles.socials}>
            <SocialLink platform="telegram" />
            <SocialLink platform="instagram" />
          </div>
          <button type="button" className={styles.cta} onClick={() => open("order")}>
            Забронировать
          </button>
          <LandingControls className={styles.controls} />
          <LandingMenu />
        </div>
      </div>
    </header>
  );
}

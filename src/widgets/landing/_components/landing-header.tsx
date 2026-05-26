"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { Logo } from "@/shared/ui/logo/Logo";
import { useEffect, useRef, useState } from "react";
import { LandingControls } from "./landing-controls";
import styles from "./landing-header.module.scss";
import { LandingMenu } from "./landing-menu";

// «Флот» lives in the dedicated «Яхты» pill, so it's not duplicated here.
const NAV = [
  { href: "/services", label: "Услуги" },
  { href: "/ceny", label: "Цены" },
  { href: "/galereya", label: "Галерея" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/contacts", label: "Контакты" },
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

        <nav className={styles.nav} aria-label="Разделы">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
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
          {/* Phone, socials and theme/locale toggles show inline only at ≥xl,
              where the full bar fits; below that they collapse into the burger
              menu (which is present on every breakpoint). */}
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

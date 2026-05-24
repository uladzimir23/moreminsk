"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./landing-menu.module.scss";

const LINKS = [
  { href: "fleet", label: "Флот" },
  { href: "services", label: "Услуги" },
  { href: "gallery", label: "Галерея" },
  { href: "reviews", label: "Отзывы" },
  { href: "faq", label: "Вопросы" },
  { href: "contact", label: "Контакты" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function LandingMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Lock body scroll + close on Esc while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  // ── Burger → X, two-stage: the lines first converge to centre, then the
  // top/bottom rotate into the cross (middle fades out). ──
  const lineTop: Variants = {
    closed: { y: -5, rotate: 0, transition: { duration: 0.35, ease: EASE } },
    open: {
      y: [-5, 0, 0],
      rotate: [0, 0, 45],
      transition: { duration: 0.45, times: [0, 0.55, 1] },
    },
  };
  const lineMid: Variants = {
    closed: { opacity: 1, scaleX: 1, transition: { duration: 0.2, delay: 0.18 } },
    open: { opacity: 0, scaleX: 0.2, transition: { duration: 0.2 } },
  };
  const lineBot: Variants = {
    closed: { y: 5, rotate: 0, transition: { duration: 0.35, ease: EASE } },
    open: {
      y: [5, 0, 0],
      rotate: [0, 0, -45],
      transition: { duration: 0.45, times: [0, 0.55, 1] },
    },
  };

  // ── Overlay reveal: circular wipe from the burger corner, then the nav
  // items cascade, then the footer block. ──
  const panel: Variants = {
    closed: reduce
      ? { opacity: 0, transition: { duration: 0.2 } }
      : {
          clipPath: "circle(0% at calc(100% - 2.75rem) 2.5rem)",
          transition: { duration: 0.4, ease: EASE },
        },
    open: reduce
      ? { opacity: 1, transition: { duration: 0.2 } }
      : {
          clipPath: "circle(150% at calc(100% - 2.75rem) 2.5rem)",
          transition: { duration: 0.55, ease: EASE },
        },
  };
  const list: Variants = {
    closed: {},
    open: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.22 } },
  };
  const item: Variants = {
    closed: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    open: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.burgerBox} aria-hidden="true">
          <motion.span
            className={styles.line}
            variants={lineTop}
            animate={open ? "open" : "closed"}
          />
          <motion.span
            className={styles.line}
            variants={lineMid}
            animate={open ? "open" : "closed"}
          />
          <motion.span
            className={styles.line}
            variants={lineBot}
            animate={open ? "open" : "closed"}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            variants={panel}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.nav className={styles.nav} variants={list} aria-label="Меню">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={`#${l.href}`}
                  className={styles.navLink}
                  variants={item}
                  onClick={jump(l.href)}
                >
                  <span className={styles.navIndex}>{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                  <svg
                    className={styles.navArrow}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.a>
              ))}

              <motion.a
                href="#booking"
                className={styles.cta}
                variants={item}
                onClick={jump("booking")}
              >
                Забронировать
              </motion.a>

              <motion.div className={styles.foot} variants={item}>
                <a href="tel:+375296953636" className={styles.phone}>
                  +375&nbsp;29&nbsp;695&nbsp;36&nbsp;36
                </a>
                <div className={styles.socials}>
                  <a
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
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MenuPreview } from "./landing-menu-preview";
import styles from "./landing-menu.module.scss";

// Real routes — the menu is the primary nav across the whole site. Each item
// carries a short blurb shown in the desktop preview pane on hover/focus.
const LINKS = [
  {
    href: "/fleet",
    label: "Флот",
    desc: "Четыре яхты под парусом и мотором — характеристики, вместимость и цена каждой.",
  },
  {
    href: "/services",
    label: "Услуги",
    desc: "Прогулки, свадьбы, дни рождения, корпоративы и фотосессии — девять сценариев на воде.",
  },
  {
    href: "/ceny",
    label: "Цены",
    desc: "Тарифы по яхтам и услугам — по-честному и на виду, без «звоните уточнить».",
  },
  {
    href: "/galereya",
    label: "Галерея",
    desc: "Кадры с прогулок, закатов и мероприятий на Минском водохранилище.",
  },
  {
    href: "/otzyvy",
    label: "Отзывы",
    desc: "Истории гостей: свадьбы, дни рождения и вечера на воде.",
  },
  {
    href: "/faq",
    label: "Вопросы",
    desc: "Как забронировать, что брать с собой, можно ли с детьми — коротко по делу.",
  },
  {
    href: "/contacts",
    label: "Контакты",
    desc: "Телефон, мессенджеры и как нас найти на причале.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const ArrowIcon = () => (
  <svg
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
);

export function LandingMenu() {
  const [open, setOpen] = useState(false);
  // Which item the desktop preview pane describes (driven by hover/focus).
  const [active, setActive] = useState(0);
  const { open: openOrder } = usePanel();
  const reduce = useReducedMotion();
  // Portal target — gated on `typeof window` so SSR returns null cleanly,
  // without the state-in-effect pattern eslint forbids.
  const portalTarget = typeof window === "undefined" ? null : document.body;

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

  const close = () => setOpen(false);

  // ── Burger → X, two-stage: the lines first converge to centre, then the
  // top/bottom rotate into the cross (middle fades out). ──
  const lineTop: Variants = {
    closed: { y: -4, rotate: 0, transition: { duration: 0.35, ease: EASE } },
    open: {
      y: [-4, 0, 0],
      rotate: [0, 0, 45],
      transition: { duration: 0.45, times: [0, 0.55, 1] },
    },
  };
  const lineMid: Variants = {
    closed: { opacity: 1, scaleX: 1, transition: { duration: 0.2, delay: 0.18 } },
    open: { opacity: 0, scaleX: 0.2, transition: { duration: 0.2 } },
  };
  const lineBot: Variants = {
    closed: { y: 4, rotate: 0, transition: { duration: 0.35, ease: EASE } },
    open: {
      y: [4, 0, 0],
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

  const activeLink = LINKS[active];

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          setActive(0); // reset the preview to the first item
        }}
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

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={styles.overlay}
                variants={panel}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Subheader — quick contacts, sits under the fixed header. */}
                <motion.div
                  className={styles.subheader}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.3, duration: 0.4, ease: EASE }}
                >
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

                <div className={styles.body}>
                  <motion.nav className={styles.nav} variants={list} aria-label="Меню">
                    {LINKS.map((l, i) => (
                      <motion.div key={l.href} variants={item}>
                        <Link
                          href={l.href}
                          className={i === active ? styles.navLinkActive : styles.navLink}
                          onClick={close}
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                        >
                          <span className={styles.navIndex}>{String(i + 1).padStart(2, "0")}</span>
                          {/* Flip effect: the word slides up out of view while an
                              accent clone slides up into it on hover/focus. */}
                          <span className={styles.navWords}>
                            <span className={styles.navWord}>{l.label}</span>
                            <span className={styles.navWordAccent} aria-hidden="true">
                              {l.label}
                            </span>
                          </span>
                          <span className={styles.navArrow} aria-hidden="true">
                            <ArrowIcon />
                          </span>
                        </Link>
                      </motion.div>
                    ))}

                    <motion.button
                      type="button"
                      className={styles.cta}
                      variants={item}
                      onClick={() => {
                        close();
                        openOrder("order");
                      }}
                    >
                      Забронировать
                    </motion.button>
                  </motion.nav>

                  {/* Desktop-only preview pane — a blurb + an explicit page link
                      for the hovered/active item. Decorative for SR (the left
                      list is the real nav), so aria-hidden + the link is removed
                      from the tab order. */}
                  <motion.aside
                    className={styles.preview}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reduce ? 0 : 0.3, duration: 0.4 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        className={styles.previewInner}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <span className={styles.previewEyebrow}>
                          {String(active + 1).padStart(2, "0")} · {activeLink.label}
                        </span>
                        <p className={styles.previewDesc}>{activeLink.desc}</p>
                        <MenuPreview index={active} onNavigate={close} />
                        <Link
                          href={activeLink.href}
                          className={styles.previewCta}
                          onClick={close}
                          tabIndex={-1}
                        >
                          Перейти на страницу
                          <ArrowIcon />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </motion.aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget,
        )}
    </>
  );
}

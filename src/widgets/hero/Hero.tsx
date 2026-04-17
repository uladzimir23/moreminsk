"use client";

import { usePanel } from "@/shared/lib/panel/usePanel";
import { Accent } from "@/shared/ui/accent/Accent";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarDays, Sailboat } from "lucide-react";
import styles from "./Hero.module.scss";

const STATS = [
  { value: "4", label: "яхты" },
  { value: "200+", label: "гостей" },
  { value: "5", label: "лет" },
];

export function Hero() {
  const { open } = usePanel();
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className={styles.root} aria-labelledby="hero-title">
      <div className={styles.container}>
        <div className={styles.media} aria-hidden="true">
          <div className={styles.mediaInner}>
            <Sailboat className={styles.mediaIcon} aria-hidden="true" />
            <span className={styles.mediaCaption}>Фото яхты — Phase 3.3</span>
          </div>
        </div>

        <motion.div className={styles.copy} variants={container} initial="hidden" animate="visible">
          <motion.span variants={item} className={styles.eyebrow}>
            Минское море
          </motion.span>

          <motion.h1 variants={item} id="hero-title" className={styles.title}>
            Яхты, на которых <Accent>возвращаются</Accent>
          </motion.h1>

          <motion.p variants={item} className={styles.lead}>
            Прозрачные цены, онлайн-бронирование, видео каждой яхты до брони.
          </motion.p>

          <motion.div variants={item} className={styles.actions}>
            <button
              type="button"
              onClick={() => open("order")}
              className={`${styles.cta} ${styles.ctaPrimary}`}
            >
              <CalendarDays className={styles.ctaIcon} aria-hidden="true" />
              Свободные даты
            </button>
            <a href="#fleet" className={`${styles.cta} ${styles.ctaGhost}`}>
              Посмотреть флот
            </a>
          </motion.div>

          <motion.dl variants={item} className={styles.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}

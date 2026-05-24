"use client";

import { FAQ } from "@/shared/content/faq";
import { useState } from "react";
import { WaterBackdrop } from "../water-backdrop";
import styles from "./faq-section.module.scss";

// First 6 «general» questions (per content/faq.ts convention).
const GENERAL = FAQ.filter((f) => f.tags.includes("general")).slice(0, 6);

export function FaqSection() {
  // One active index drives both layouts: desktop side panel + mobile accordion.
  const [active, setActive] = useState(0);

  const toggle = (i: number) => setActive((cur) => (cur === i ? -1 : i));

  const Chevron = () => (
    <span className={styles.marker} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  );

  const activeItem = active >= 0 ? GENERAL[active] : GENERAL[0];

  return (
    <section className={styles.section} id="faq">
      <WaterBackdrop filterId="faqWater" variant="waves" />
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>05 · Вопросы</p>
          <h2 className={styles.title}>
            Коротко о <span className={styles.accent}>главном.</span>
          </h2>
        </div>

        <div className={styles.grid}>
          <ul className={styles.list}>
            {GENERAL.map((item, i) => (
              <li key={item.id} className={styles.item}>
                <button
                  type="button"
                  className={i === active ? styles.qActive : styles.q}
                  onClick={() => toggle(i)}
                  aria-expanded={i === active}
                >
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.qText}>{item.question}</span>
                  <Chevron />
                </button>
                <div
                  className={`${styles.inlineAnswer} ${i === active ? styles.inlineAnswerOpen : ""}`}
                >
                  {item.answer}
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.panel}>
            <div className={styles.panelInner} key={active}>
              <p className={styles.panelQ}>{activeItem.question}</p>
              <p className={styles.panelA}>{activeItem.answer}</p>
              <a href="#contact" className={styles.panelLink}>
                Остались вопросы? Напишите →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

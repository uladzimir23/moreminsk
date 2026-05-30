"use client";

import { FAQ } from "@/shared/content/faq";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useState } from "react";
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
      <div className={styles.inner}>
        <SectionHeader eyebrow="05 · Вопросы" title="Коротко о" accent="главном." tone="media" />

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
                  {/* Body обёрнут в дочерний div — он clip'ает overflow, а grid-rows
                      trick (0fr → 1fr) на родителе плавно анимирует высоту с auto. */}
                  <div className={styles.inlineAnswerBody}>
                    {item.answer}
                    {item.bullets && (
                      <ul className={styles.bullets}>
                        {item.bullets.map((b) => (
                          <li key={b} className={styles.bullet}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.panel}>
            <div className={styles.panelInner} key={active}>
              <p className={styles.panelQ}>{activeItem.question}</p>
              <p className={styles.panelA}>{activeItem.answer}</p>
              {activeItem.bullets && (
                <ul className={styles.bullets}>
                  {activeItem.bullets.map((b) => (
                    <li key={b} className={styles.bullet}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
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

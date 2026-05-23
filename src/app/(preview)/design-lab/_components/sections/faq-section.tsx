import { FAQ } from "@/shared/content/faq";
import styles from "./faq-section.module.scss";

// Show the first 6 «general» questions (per content/faq.ts convention);
// a link points to the full /faq page.
const GENERAL = FAQ.filter((f) => f.tags.includes("general")).slice(0, 6);

export function FaqSection() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>05 · Вопросы</p>
          <h2 className={styles.title}>
            Коротко о <span className={styles.accent}>главном.</span>
          </h2>
        </div>

        {GENERAL.map((item) => (
          <details key={item.id} className={styles.item}>
            <summary className={styles.summary}>
              {item.question}
              <span className={styles.marker} aria-hidden="true" />
            </summary>
            <div className={styles.answer}>{item.answer}</div>
          </details>
        ))}

        <a href="#contact" className={styles.footLink}>
          Остались вопросы? Напишите нам →
        </a>
      </div>
    </section>
  );
}

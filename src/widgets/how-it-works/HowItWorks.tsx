import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { CalendarCheck, MessageSquareText, Sailboat, Send } from "lucide-react";
import styles from "./HowItWorks.module.scss";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Заявка",
    text: "Пишете в Telegram или через форму — указываете дату, гостей, повод.",
  },
  {
    icon: CalendarCheck,
    title: "Подтверждение",
    text: "Подбираем яхту и капитана, фиксируем дату предоплатой 30%.",
  },
  {
    icon: Sailboat,
    title: "Выход в море",
    text: "Встречаем в Качино, инструктаж 10 минут — и вы на воде.",
  },
  {
    icon: Send,
    title: "После",
    text: "Присылаем фото с прогулки и ссылку на оставление отзыва.",
  },
];

export function HowItWorks() {
  return (
    <section className={styles.root} aria-labelledby="how-title">
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Как это работает"
          title="От заявки до выхода в море — 4 шага"
          subtitle="Процесс без сюрпризов: знаете заранее, что вас ждёт и сколько стоит."
          id="how-title"
        />
        <ol className={styles.steps}>
          {STEPS.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.stepIcon} aria-hidden="true">
                  <step.icon className={styles.icon} />
                </span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

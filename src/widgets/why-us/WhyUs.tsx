import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { Camera, ClipboardCheck, MessageCircle, Tag } from "lucide-react";
import styles from "./WhyUs.module.scss";

const PILLARS = [
  {
    icon: Tag,
    title: "Цена на сайте",
    text: "Без «звоните уточнить» — все пакеты и цены видно сразу.",
  },
  {
    icon: ClipboardCheck,
    title: "Капитан и топливо включены",
    text: "Итоговый счёт — тот же, что в объявлении. Никаких сюрпризов.",
  },
  {
    icon: Camera,
    title: "Реальные фото яхт",
    text: "Смотрите каждую яхту в галерее и видео — без стоков.",
  },
  {
    icon: MessageCircle,
    title: "Ответ за 30 минут",
    text: "Telegram с 9:00 до 22:00 без выходных. Пишите когда удобно.",
  },
];

export function WhyUs() {
  return (
    <section className={styles.root} aria-labelledby="why-us-title">
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Почему мы"
          title="Четыре причины бронировать у нас"
          subtitle="Работаем пятый сезон на Минском море — и знаем, чего ждут гости на яхте."
          id="why-us-title"
        />
        <ul className={styles.grid}>
          {PILLARS.map((p) => (
            <li key={p.title} className={styles.card}>
              <span className={styles.iconWrap} aria-hidden="true">
                <p.icon className={styles.icon} />
              </span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

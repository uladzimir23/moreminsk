"use client";

import { FAQ, type FaqItem } from "@/shared/content/faq";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Send } from "lucide-react";
import styles from "./FaqPage.module.scss";

// Group order and labels. First tag on each item determines primary group.
const GROUPS: { tag: string; title: string }[] = [
  { tag: "booking", title: "Бронирование" },
  { tag: "payment", title: "Оплата" },
  { tag: "fleet", title: "Флот и гости" },
  { tag: "general", title: "Остальное" },
];

function groupFor(item: FaqItem): string {
  for (const g of GROUPS) {
    if (item.tags.includes(g.tag)) return g.tag;
  }
  return "general";
}

export function FaqPage() {
  const grouped: Record<string, FaqItem[]> = Object.fromEntries(GROUPS.map((g) => [g.tag, []]));
  for (const item of FAQ) {
    const tag = groupFor(item);
    grouped[tag].push(item);
  }

  return (
    <section className={styles.root} aria-labelledby="faq-page-title">
      <div className={styles.container}>
        <span className={styles.eyebrow}>FAQ</span>
        <h1 id="faq-page-title" className={styles.h1}>
          Частые вопросы
        </h1>
        <p className={styles.lead}>
          Собрали всё, что спрашивают до бронирования. Если ответа здесь нет — напишите в Telegram,
          ответим за 30 минут.
        </p>

        {GROUPS.map((group) => {
          const items = grouped[group.tag];
          if (!items || items.length === 0) return null;
          return (
            <div key={group.tag} className={styles.group}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <Accordion.Root type="single" collapsible className={styles.list}>
                {items.map((item) => (
                  <Accordion.Item key={item.id} value={item.id} className={styles.item}>
                    <Accordion.Header className={styles.header}>
                      <Accordion.Trigger className={styles.trigger}>
                        <span className={styles.question}>{item.question}</span>
                        <ChevronDown className={styles.chevron} aria-hidden="true" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className={styles.content}>
                      <p className={styles.answer}>{item.answer}</p>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          );
        })}

        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Не нашли ответа?</h2>
          <p className={styles.ctaLead}>Напишите в Telegram — отвечаем за 30 минут.</p>
          <a
            href="https://t.me/moreminsk"
            target="_blank"
            rel="noreferrer"
            className={styles.ctaLink}
          >
            <Send aria-hidden="true" style={{ inlineSize: "1rem", blockSize: "1rem" }} />
            Написать @moreminsk
          </a>
        </div>
      </div>
    </section>
  );
}

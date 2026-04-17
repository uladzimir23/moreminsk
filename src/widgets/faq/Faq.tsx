"use client";

import { FAQ } from "@/shared/content/faq";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import styles from "./Faq.module.scss";

// Home page shows only the first 6 general questions. The full list + service-specific
// items land on /faq (Phase 4).
const ITEMS = FAQ.filter((f) => f.tags.includes("general")).slice(0, 6);

export function Faq() {
  return (
    <section className={styles.root} aria-labelledby="faq-title">
      <div className={styles.container}>
        <SectionHeader
          eyebrow="FAQ"
          title="Что чаще всего спрашивают"
          subtitle="Не нашли ответа — напишите в Telegram @moreminsk, ответим за 30 минут."
          id="faq-title"
        />

        <Accordion.Root type="single" collapsible className={styles.list}>
          {ITEMS.map((item) => (
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
    </section>
  );
}

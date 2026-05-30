"use client";

import { DOCUMENTS } from "@/shared/content/documents";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Send } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./DocumentsPage.module.scss";

// Юридические документы — оферта, ТБ, согласие на ПДн. Каждый — раскрывающийся
// блок (Radix Accordion). Анкор в URL (#oferta/#safety/#consent) автораскрывает
// нужный раздел — на это и завязаны ссылки в футере.

// Параграф из ALL CAPS = заголовок раздела внутри документа (Tilda-маркап
// не различал, но визуально важно для длинной оферты).
const isHeading = (line: string) => {
  const letters = line.replace(/[^\p{L}]/gu, "");
  if (letters.length < 3) return false;
  // Допускаем нумерацию вроде «1. ПРЕДМЕТ» и «ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ».
  const upper = letters.toLocaleUpperCase("ru");
  return letters === upper && /[A-ZА-Я]/.test(letters);
};

export function DocumentsPage() {
  const [open, setOpen] = useState<string>("");

  // Раскрыть документ по хешу при заходе по ссылке (#oferta / #safety / #consent).
  // setOpen в useEffect — react-hooks/set-state-in-effect ругается, но альтернатива
  // (lazy useState init) недоступна: window.location.hash не существует на сервере.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && DOCUMENTS.some((d) => d.slug === hash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(hash);
      // Скролл к открытому разделу — после раскрытия, чтобы попасть на верх блока.
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    }
  }, []);

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Документы" }]}
          eyebrow="Документы"
          title="Юридические"
          accent="документы."
          lead="Оферта, техника безопасности и согласие на обработку данных. По закону РБ — обязательная информация. Если что-то непонятно, напишите в Telegram, ответим за 30 минут."
          image={COVER_BY_YACHT.bravo}
          titleId="documents-title"
        />
      }
    >
      <section className={styles.root} aria-labelledby="documents-title">
        <div className={styles.container}>
          <Accordion.Root
            type="single"
            collapsible
            value={open}
            onValueChange={setOpen}
            className={styles.list}
          >
            {DOCUMENTS.map((doc) => (
              <Accordion.Item key={doc.slug} value={doc.slug} id={doc.slug} className={styles.item}>
                <Accordion.Header className={styles.header}>
                  <Accordion.Trigger className={styles.trigger}>
                    <span className={styles.title}>{doc.title}</span>
                    <span className={styles.lead}>{doc.lead}</span>
                    <ChevronDown className={styles.chevron} aria-hidden="true" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className={styles.content}>
                  <div className={styles.body}>
                    {doc.paragraphs.map((line, i) =>
                      isHeading(line) ? (
                        <h3 key={i} className={styles.h}>
                          {line}
                        </h3>
                      ) : (
                        <p key={i} className={styles.p}>
                          {line}
                        </p>
                      ),
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Остались вопросы по документам?</h2>
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
    </PageShell>
  );
}

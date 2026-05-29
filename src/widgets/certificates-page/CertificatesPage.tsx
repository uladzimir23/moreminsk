"use client";

import { QuickBooking } from "@/features/booking/QuickBooking";
import { CERTIFICATE } from "@/shared/content/certificates";
import { withBase } from "@/shared/lib/base-path";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, Clock, Wallet, X } from "lucide-react";
import { useState } from "react";
import styles from "./CertificatesPage.module.scss";

export function CertificatesPage() {
  const [bookOpen, setBookOpen] = useState(false);
  const photos = CERTIFICATE.photos.map(withBase);

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Сертификаты" }]}
          eyebrow="Подарок"
          title="Подарочный"
          accent="сертификат."
          lead={CERTIFICATE.lead}
          image={photos[0]}
          titleId="cert-title"
        />
      }
    >
      <section className={styles.section} aria-labelledby="cert-title">
        <AmbientBackdrop images={photos} activeIndex={0} className={styles.sectionBg} />
        <SectionHeader
          eyebrow="Сертификат"
          title="Впечатление"
          accent="в подарок."
          tone="media"
          framed
        />

        <div className={styles.inner}>
          <div className={styles.grid}>
            <div className={styles.galleryCol}>
              <YachtGallery
                photos={photos}
                name="сертификат"
                alts={CERTIFICATE.photoAlts}
                zoomable
                eager
              />
            </div>

            <div className={styles.offer}>
              {CERTIFICATE.offer.map((p) => (
                <p key={p} className={styles.offerPara}>
                  {p}
                </p>
              ))}

              <div className={styles.priceRow}>
                <Wallet className={styles.priceIcon} aria-hidden="true" />
                <span className={styles.priceLabel}>Стоимость сертификата</span>
                <span className={styles.priceValue}>от {CERTIFICATE.priceFrom} BYN</span>
              </div>

              <p className={styles.season}>
                <Clock className={styles.seasonIcon} aria-hidden="true" />
                Действует весь сезон: {CERTIFICATE.season}
              </p>

              <button type="button" className={styles.cta} onClick={() => setBookOpen(true)}>
                <CalendarDays className={styles.ctaIcon} aria-hidden="true" />
                Заказать сертификат
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`} aria-labelledby="cert-faq">
        <div className={styles.inner}>
          <SectionHeader
            id="cert-faq"
            eyebrow="FAQ"
            title="Частые"
            accent="вопросы."
            tone="media"
          />
          <ul className={styles.faqList}>
            {CERTIFICATE.faq.map((item) => (
              <li key={item.id} className={styles.faqItem}>
                <p className={styles.faqQ}>{item.question}</p>
                <p className={styles.faqA}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Booking popup — same QuickBooking form, marked as a certificate order. */}
      <Dialog.Root open={bookOpen} onOpenChange={setBookOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dlgOverlay} />
          <Dialog.Content className={styles.dlgContent} aria-describedby={undefined}>
            <div className={styles.dlgHandle} aria-hidden="true" />
            <header className={styles.dlgHeader}>
              <Dialog.Title className={styles.dlgTitle}>Заказать сертификат</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className={styles.dlgClose} aria-label="Закрыть">
                  <X aria-hidden="true" />
                </button>
              </Dialog.Close>
            </header>
            <QuickBooking yacht={{ name: "Подарочный сертификат" }} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </PageShell>
  );
}

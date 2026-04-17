"use client";

import { BookingForm } from "@/features/booking/BookingForm";
import { useBookingStore } from "@/features/booking/model/store";
import type { BookingPanelPayload, BookingSource } from "@/features/booking/model/types";
import type { PanelMode } from "@/shared/lib/panel/types";
import { usePanel } from "@/shared/lib/panel/usePanel";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "./AppPanel.module.scss";

const TITLE: Record<PanelMode, string> = {
  order: "Заказать яхту",
  "fleet-filter": "Фильтры флота",
  more: "Ещё",
  gallery: "Галерея",
};

const PLACEHOLDER: Record<Exclude<PanelMode, "order">, string> = {
  "fleet-filter": "Фильтры по типу яхты, вместимости, длине и дате — Phase 3.2.",
  more: "Вторичные ссылки (FAQ, Отзывы, О нас, Блог, Контакты) — Phase 3.2.",
  gallery: "Lightbox-галерея с свайпом — Phase 5.",
};

export function AppPanel() {
  const { isOpen, mode, close, payload } = usePanel();
  const hydrate = useBookingStore((s) => s.hydrateFromPayload);
  const hydratedFor = useRef<string | null>(null);

  // Hydrate booking draft once per open of the order panel. Re-hydrate is
  // keyed by (payload identity) so re-opening from the same card doesn't
  // wipe user progress mid-session.
  useEffect(() => {
    if (!isOpen || mode !== "order") {
      hydratedFor.current = null;
      return;
    }
    const key = JSON.stringify(payload ?? null);
    if (hydratedFor.current === key) return;
    hydratedFor.current = key;
    const bookingPayload = (payload as BookingPanelPayload | undefined) ?? undefined;
    const source: BookingSource = bookingPayload?.source ?? "appbar";
    hydrate(bookingPayload, source);
  }, [isOpen, mode, payload, hydrate]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(next) => !next && close()}>
      <AnimatePresence>
        {isOpen && mode && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              aria-describedby={undefined}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                className={styles.content}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className={styles.handle} aria-hidden="true" />

                <header className={styles.header}>
                  <Dialog.Title className={styles.title}>{TITLE[mode]}</Dialog.Title>
                  <VisuallyHidden>
                    <Dialog.Description>
                      Панель «{TITLE[mode]}» открыта. Закрыть можно клавишей Escape или кнопкой
                      закрытия.
                    </Dialog.Description>
                  </VisuallyHidden>
                  <Dialog.Close asChild>
                    <button type="button" aria-label="Закрыть" className={styles.close}>
                      <X className={styles.closeIcon} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </header>

                <div className={styles.body}>
                  {mode === "order" ? (
                    <BookingForm />
                  ) : (
                    <p className={styles.placeholder}>{PLACEHOLDER[mode]}</p>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

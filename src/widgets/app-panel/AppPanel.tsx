"use client";

import type { PanelMode } from "@/shared/lib/panel/types";
import { usePanel } from "@/shared/lib/panel/usePanel";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import styles from "./AppPanel.module.scss";

const TITLE: Record<PanelMode, string> = {
  order: "Заказать яхту",
  "fleet-filter": "Фильтры флота",
  more: "Ещё",
  gallery: "Галерея",
};

// Mode-specific bodies land in `./contents/` in a later phase (ADR-007 §
// "Один компонент = большой файл"). For now each mode renders a placeholder.
const PLACEHOLDER: Record<PanelMode, string> = {
  order: "Форма бронирования появится на этапе Phase 3.4 (booking wizard).",
  "fleet-filter": "Фильтры по типу яхты, вместимости, длине и дате — Phase 3.2.",
  more: "Вторичные ссылки (FAQ, Отзывы, О нас, Блог, Контакты) — Phase 3.2.",
  gallery: "Lightbox-галерея с свайпом — Phase 5.",
};

export function AppPanel() {
  const { isOpen, mode, close } = usePanel();

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
                  <p className={styles.placeholder}>{PLACEHOLDER[mode]}</p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

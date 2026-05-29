"use client";

import { QuickBooking } from "@/features/booking/QuickBooking";
import { YACHTS } from "@/shared/content/yachts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import styles from "./BookingPanel.module.scss";

// Global booking popup — site-wide `usePanel().open("order", payload?)` opens
// this. Payload may carry { yacht: slug } from a yacht-specific CTA so
// QuickBooking prefills the boat name; without it, the form sends a generic
// «На выбор» and Pavel discusses on call. Same minimalist form the user
// already approved on yacht-detail pages, just lifted to a global subscriber
// so every dead `open("order")` site-wide actually opens something.

type Payload = { yacht?: string; service?: string };

export function BookingPanel() {
  const { isOpen, mode, payload, close } = usePanel();
  const isOrder = isOpen && mode === "order";

  const p = (payload ?? {}) as Payload;
  const yacht = p.yacht ? (YACHTS.find((y) => y.slug === p.yacht) ?? null) : null;
  const yachtName = yacht ? yacht.name : "На выбор";

  return (
    <Dialog.Root open={isOrder} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <div className={styles.handle} aria-hidden="true" />
          <header className={styles.header}>
            <Dialog.Title className={styles.title}>
              {yacht ? `Бронирование ${yacht.name}` : "Бронирование"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className={styles.closeBtn} aria-label="Закрыть">
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </header>
          <QuickBooking yacht={{ name: yachtName }} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

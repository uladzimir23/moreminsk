"use client";

import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import formStyles from "../../BookingForm.module.scss";
import { durationLabel, TIME_SLOTS } from "../../model/durations";
import { calcPrice, formatPrice } from "../../model/price";
import { useBookingStore } from "../../model/store";
import { WizardNav } from "../WizardNav";
import styles from "./SummaryStep.module.scss";

const CONTACT_LABELS: Record<string, string> = {
  telegram: "Telegram",
  phone: "Звонок",
  whatsapp: "WhatsApp",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" });
}

function timeSlotLabel(slot?: string): string | null {
  if (!slot) return null;
  return TIME_SLOTS.find((s) => s.value === slot)?.label ?? slot;
}

function yachtName(slug: string | undefined): string {
  if (!slug || slug === "any") return "Подберёт менеджер";
  return YACHTS.find((y) => y.slug === slug)?.name ?? "—";
}

function packageLabel(pkg: { kind: string; serviceSlug?: string }): string {
  if (pkg.kind === "none") return "Просто аренда";
  const title = SERVICES.find((s) => s.slug === pkg.serviceSlug)?.shortTitle ?? "—";
  return pkg.kind === "turnkey" ? `${title} (под ключ)` : title;
}

export function SummaryStep() {
  const { draft, patch, goBack, goNext } = useBookingStore();
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(() => calcPrice(draft), [draft]);
  const timeLabel = timeSlotLabel(draft.timeSlot);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.policyAccepted) {
      setError("Нужно согласие с политикой обработки данных");
      return;
    }
    setError(null);
    goNext();
  };

  const togglePolicy = () => {
    patch({ policyAccepted: !draft.policyAccepted });
    if (!draft.policyAccepted) setError(null);
  };

  return (
    <form className={styles.root} onSubmit={onSubmit}>
      <h2 className={formStyles.stepTitle}>Проверьте детали</h2>
      <p className={formStyles.stepLead}>
        Менеджер уточнит доступность слота и подтвердит цену в ответном сообщении.
      </p>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Яхта</span>
          <span className={styles.rowValue}>{yachtName(draft.yachtSlug)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Дата</span>
          <span className={styles.rowValue}>
            {draft.date ? formatDate(draft.date) : "—"}
            {timeLabel ? ` · ${timeLabel}` : ""}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Длительность</span>
          <span className={styles.rowValue}>
            {draft.duration ? durationLabel(draft.duration) : "—"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Повод</span>
          <span className={styles.rowValue}>{packageLabel(draft.package)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Гостей</span>
          <span className={styles.rowValue}>{draft.guests ?? "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Контакт</span>
          <span className={styles.rowValue}>
            {draft.contact.name ?? "—"} · {draft.contact.phone ?? "—"}
            {draft.contact.preferredContact
              ? ` · ${CONTACT_LABELS[draft.contact.preferredContact]}`
              : ""}
          </span>
        </div>
        {draft.contact.comment && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Комментарий</span>
            <span className={styles.rowValue}>{draft.contact.comment}</span>
          </div>
        )}
      </div>

      <div className={styles.price}>
        <span className={styles.priceLabel}>Предварительная цена</span>
        <span className={styles.priceValue}>{formatPrice(estimate)}</span>
        <span className={styles.priceBreakdown}>
          {estimate.kind === "exact" ? estimate.breakdown : estimate.reason}
        </span>
      </div>

      <label className={styles.policy}>
        <input
          type="checkbox"
          checked={draft.policyAccepted}
          onChange={togglePolicy}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
        />
        <span
          className={styles.checkbox}
          data-checked={draft.policyAccepted}
          aria-hidden="true"
          onClick={(e) => {
            e.preventDefault();
            togglePolicy();
          }}
        >
          <Check size={14} />
        </span>
        <span className={styles.policyText}>
          Согласен с{" "}
          <a
            href="/legal/politika"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.policyLink}
          >
            политикой обработки персональных данных
          </a>
        </span>
      </label>

      {error && (
        <p role="alert" className={styles.errorMsg}>
          {error}
        </p>
      )}

      <WizardNav onBack={goBack} nextType="submit" nextLabel="Отправить заявку" />
    </form>
  );
}

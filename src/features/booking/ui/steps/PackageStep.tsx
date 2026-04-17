"use client";

import { SERVICES } from "@/shared/content/services";
import { Check } from "lucide-react";
import formStyles from "../../BookingForm.module.scss";
import { useBookingStore } from "../../model/store";
import type { PackageRef, ServiceSlug } from "../../model/types";
import { WizardNav } from "../WizardNav";
import styles from "./PackageStep.module.scss";

type PlainOption = { value: "none"; label: string } | { value: ServiceSlug; label: string };

export function PackageStep() {
  const { draft, patch, goBack, goNext } = useBookingStore();
  const pkg = draft.package;

  const plainOptions: PlainOption[] = [
    { value: "none", label: "Просто аренда" },
    ...SERVICES.map((s) => ({ value: s.slug as ServiceSlug, label: s.shortTitle })),
  ];

  const isTurnkey = pkg.kind === "turnkey";
  const currentServiceSlug =
    pkg.kind === "service" || pkg.kind === "turnkey" ? pkg.serviceSlug : undefined;

  const selectPlain = (opt: PlainOption) => {
    let next: PackageRef;
    if (opt.value === "none") {
      next = { kind: "none" };
    } else {
      next = { kind: isTurnkey ? "turnkey" : "service", serviceSlug: opt.value };
    }
    patch({ package: next });
  };

  const toggleTurnkey = () => {
    if (pkg.kind === "none") return; // need a service selected first
    const next: PackageRef =
      pkg.kind === "turnkey"
        ? { kind: "service", serviceSlug: pkg.serviceSlug }
        : { kind: "turnkey", serviceSlug: pkg.serviceSlug };
    patch({ package: next });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goNext();
  };

  const turnkeyEnabled = pkg.kind !== "none";

  return (
    <form className={styles.root} onSubmit={onSubmit}>
      <h2 className={formStyles.stepTitle}>Повод (опционально)</h2>
      <p className={formStyles.stepLead}>
        Расскажем менеджеру про формат, чтобы сразу подобрал подходящее.
      </p>

      <ul className={styles.options} role="radiogroup" aria-label="Повод">
        {plainOptions.map((opt) => {
          const isActive =
            opt.value === "none" ? pkg.kind === "none" : currentServiceSlug === opt.value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`${styles.option} ${isActive ? styles.optionSelected : ""}`}
                onClick={() => selectPlain(opt)}
              >
                <span className={styles.radio} aria-hidden="true">
                  {isActive && <span className={styles.radioDot} />}
                </span>
                <span className={styles.label}>{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.divider} aria-hidden="true" />

      <button
        type="button"
        role="checkbox"
        aria-checked={isTurnkey}
        aria-disabled={!turnkeyEnabled}
        className={`${styles.turnkey} ${isTurnkey ? styles.turnkeyActive : ""} ${
          !turnkeyEnabled ? styles.turnkeyDisabled : ""
        }`}
        onClick={() => turnkeyEnabled && toggleTurnkey()}
      >
        <span className={styles.turnkeyCheck} aria-hidden="true">
          <Check size={14} />
        </span>
        <span className={styles.turnkeyBody}>
          <span className={styles.turnkeyTitle}>Пакет «под ключ»</span>
          <span className={styles.turnkeyText}>
            Декор, кейтеринг, фото, музыка — полная организация. Цена индивидуальная, менеджер
            рассчитает после заявки.
          </span>
        </span>
      </button>

      <WizardNav onBack={goBack} nextType="submit" />
    </form>
  );
}

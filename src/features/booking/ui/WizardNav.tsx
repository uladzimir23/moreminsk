"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./WizardNav.module.scss";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextType?: "button" | "submit";
  nextDisabled?: boolean;
  nextBusy?: boolean;
  showBack?: boolean;
};

export function WizardNav({
  onBack,
  onNext,
  nextLabel = "Далее",
  nextType = "button",
  nextDisabled = false,
  nextBusy = false,
  showBack = true,
}: Props) {
  return (
    <div className={styles.root}>
      {showBack && (
        <button
          type="button"
          className={styles.back}
          onClick={onBack}
          aria-label="Назад"
          disabled={nextBusy}
        >
          <ArrowLeft aria-hidden="true" size={18} />
        </button>
      )}
      <button
        type={nextType}
        className={styles.next}
        onClick={onNext}
        disabled={nextDisabled || nextBusy}
      >
        {nextBusy ? "Отправляем…" : nextLabel}
        {!nextBusy && <ArrowRight aria-hidden="true" size={18} />}
      </button>
    </div>
  );
}

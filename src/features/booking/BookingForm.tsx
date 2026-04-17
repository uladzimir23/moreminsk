"use client";

import styles from "./BookingForm.module.scss";
import { useBookingStore, type WizardStep } from "./model/store";
import { StepIndicator } from "./ui/StepIndicator";
import { WizardNav } from "./ui/WizardNav";

const TOTAL_STEPS = 5;

const STUB_TITLES: Record<WizardStep, string> = {
  1: "Выберите яхту",
  2: "Когда?",
  3: "Повод (опционально)",
  4: "Как с вами связаться?",
  5: "Проверьте детали",
  6: "Заявка отправлена",
};

// Per-step content is added in subsequent commits (YachtStep → DateTimeStep → …).
// Shell renders the step frame, indicator and nav; each step owns its own form/validation.

type StepProps = {
  onBack: () => void;
  onNext: () => void;
};

function StubStep({ step, onBack, onNext }: StepProps & { step: WizardStep }) {
  const isFirst = step === 1;
  return (
    <>
      <h2 className={styles.stepTitle}>{STUB_TITLES[step]}</h2>
      <div className={styles.stub}>Этот шаг появится в следующих коммитах фазы 3.4.</div>
      <WizardNav showBack={!isFirst} onBack={onBack} onNext={onNext} />
    </>
  );
}

export function BookingForm() {
  const { step, goNext, goBack } = useBookingStore();

  return (
    <div className={styles.root}>
      {step !== 6 && <StepIndicator current={step} total={TOTAL_STEPS} />}
      <div className={styles.stage}>
        <StubStep step={step} onBack={goBack} onNext={goNext} />
      </div>
    </div>
  );
}

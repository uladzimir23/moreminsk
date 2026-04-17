"use client";

import styles from "./BookingForm.module.scss";
import { useBookingStore, type WizardStep } from "./model/store";
import { StepIndicator } from "./ui/StepIndicator";
import { WizardNav } from "./ui/WizardNav";
import { YachtStep } from "./ui/steps/YachtStep";

const TOTAL_STEPS = 5;

const STUB_TITLES: Record<Exclude<WizardStep, 1>, string> = {
  2: "Когда?",
  3: "Повод (опционально)",
  4: "Как с вами связаться?",
  5: "Проверьте детали",
  6: "Заявка отправлена",
};

// Per-step content is added in subsequent commits (DateTimeStep → PackageStep → …).
// Shell renders the step frame, indicator and nav; each step owns its own form/validation.

function StubStep({ step }: { step: Exclude<WizardStep, 1> }) {
  const { goBack, goNext } = useBookingStore();
  return (
    <>
      <h2 className={styles.stepTitle}>{STUB_TITLES[step]}</h2>
      <div className={styles.stub}>Этот шаг появится в следующих коммитах фазы 3.4.</div>
      <WizardNav onBack={goBack} onNext={goNext} />
    </>
  );
}

export function BookingForm() {
  const step = useBookingStore((s) => s.step);

  return (
    <div className={styles.root}>
      {step !== 6 && <StepIndicator current={step} total={TOTAL_STEPS} />}
      <div className={styles.stage}>{step === 1 ? <YachtStep /> : <StubStep step={step} />}</div>
    </div>
  );
}

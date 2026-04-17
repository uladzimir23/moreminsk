"use client";

import styles from "./BookingForm.module.scss";
import { useBookingStore, type WizardStep } from "./model/store";
import { StepIndicator } from "./ui/StepIndicator";
import { WizardNav } from "./ui/WizardNav";
import { DateTimeStep } from "./ui/steps/DateTimeStep";
import { PackageStep } from "./ui/steps/PackageStep";
import { YachtStep } from "./ui/steps/YachtStep";

const TOTAL_STEPS = 5;

type StubStepNum = 4 | 5 | 6;
const STUB_TITLES: Record<StubStepNum, string> = {
  4: "Как с вами связаться?",
  5: "Проверьте детали",
  6: "Заявка отправлена",
};

// Per-step content is added in subsequent commits (DateTimeStep → PackageStep → …).
// Shell renders the step frame, indicator and nav; each step owns its own form/validation.

function StubStep({ step }: { step: StubStepNum }) {
  const { goBack, goNext } = useBookingStore();
  return (
    <>
      <h2 className={styles.stepTitle}>{STUB_TITLES[step]}</h2>
      <div className={styles.stub}>Этот шаг появится в следующих коммитах фазы 3.4.</div>
      <WizardNav onBack={goBack} onNext={goNext} />
    </>
  );
}

function renderStep(step: WizardStep) {
  if (step === 1) return <YachtStep />;
  if (step === 2) return <DateTimeStep />;
  if (step === 3) return <PackageStep />;
  return <StubStep step={step} />;
}

export function BookingForm() {
  const step = useBookingStore((s) => s.step);

  return (
    <div className={styles.root}>
      {step !== 6 && <StepIndicator current={step} total={TOTAL_STEPS} />}
      <div className={styles.stage}>{renderStep(step)}</div>
    </div>
  );
}

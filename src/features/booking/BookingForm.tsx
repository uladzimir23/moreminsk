"use client";

import styles from "./BookingForm.module.scss";
import { useBookingStore, type WizardStep } from "./model/store";
import { StepIndicator } from "./ui/StepIndicator";
import { ContactStep } from "./ui/steps/ContactStep";
import { DateTimeStep } from "./ui/steps/DateTimeStep";
import { PackageStep } from "./ui/steps/PackageStep";
import { SuccessStep } from "./ui/steps/SuccessStep";
import { SummaryStep } from "./ui/steps/SummaryStep";
import { YachtStep } from "./ui/steps/YachtStep";

const TOTAL_STEPS = 5;

function renderStep(step: WizardStep) {
  if (step === 1) return <YachtStep />;
  if (step === 2) return <DateTimeStep />;
  if (step === 3) return <PackageStep />;
  if (step === 4) return <ContactStep />;
  if (step === 5) return <SummaryStep />;
  return <SuccessStep />;
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

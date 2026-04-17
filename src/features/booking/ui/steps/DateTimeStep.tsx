"use client";

import { useState } from "react";
import formStyles from "../../BookingForm.module.scss";
import { dateTimeStepSchema } from "../../model/schema";
import { useBookingStore } from "../../model/store";
import type { DurationOption, YachtSlug } from "../../model/types";
import { Calendar } from "../Calendar";
import { DurationPicker } from "../DurationPicker";
import { TimeSlotPicker } from "../TimeSlotPicker";
import { WizardNav } from "../WizardNav";
import stepStyles from "./DateTimeStep.module.scss";

function isYachtSlug(v: string | undefined): v is YachtSlug {
  return v === "eva" || v === "alfa" || v === "mario" || v === "bravo";
}

export function DateTimeStep() {
  const { draft, patch, goBack, goNext } = useBookingStore();
  const [error, setError] = useState<string | null>(null);

  const hideTimeSlot = draft.duration?.kind === "night" || draft.duration?.kind === "multi-day";

  const setDate = (date: string) => {
    patch({ date });
    setError(null);
  };
  const setDuration = (duration: DurationOption) => {
    const patchData: { duration: DurationOption; timeSlot?: string } = { duration };
    if (duration.kind === "night" || duration.kind === "multi-day") {
      patchData.timeSlot = undefined;
    }
    patch(patchData);
    setError(null);
  };
  const setTimeSlot = (timeSlot: string) => {
    patch({ timeSlot });
    setError(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = dateTimeStepSchema.safeParse({
      date: draft.date,
      duration: draft.duration,
      timeSlot: draft.timeSlot,
    });
    if (!result.success) {
      const first = result.error.issues[0];
      setError(first?.message ?? "Заполните все поля");
      return;
    }
    setError(null);
    goNext();
  };

  const yachtSlug = isYachtSlug(draft.yachtSlug) ? draft.yachtSlug : undefined;

  return (
    <form className={stepStyles.root} onSubmit={onSubmit}>
      <h2 className={formStyles.stepTitle}>Когда?</h2>
      <p className={formStyles.stepLead}>
        Дата, длительность и удобное время. Менеджер подтвердит слот после отправки заявки.
      </p>

      <Calendar value={draft.date} onChange={setDate} yachtSlug={yachtSlug} />

      <DurationPicker value={draft.duration} onChange={setDuration} />

      {!hideTimeSlot && <TimeSlotPicker value={draft.timeSlot} onChange={setTimeSlot} />}

      {error && (
        <p role="alert" className={stepStyles.error}>
          {error}
        </p>
      )}

      <WizardNav onBack={goBack} nextType="submit" />
    </form>
  );
}

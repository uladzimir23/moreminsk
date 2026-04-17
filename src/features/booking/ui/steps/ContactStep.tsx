"use client";

import { YACHTS } from "@/shared/content/yachts";
import { AsYouType } from "libphonenumber-js";
import { useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import formStyles from "../../BookingForm.module.scss";
import { contactStepSchema, type ContactStepValues } from "../../model/schema";
import { useBookingStore } from "../../model/store";
import chipStyles from "../ChipGroup.module.scss";
import { WizardNav } from "../WizardNav";
import styles from "./ContactStep.module.scss";

type FormValues = {
  name: string;
  phone: string;
  preferredContact: "telegram" | "phone" | "whatsapp";
  email: string;
  guests: number;
  comment: string;
};

const CONTACT_OPTIONS: Array<{ value: FormValues["preferredContact"]; label: string }> = [
  { value: "telegram", label: "Telegram" },
  { value: "phone", label: "Звонок" },
  { value: "whatsapp", label: "WhatsApp" },
];

function formatPhone(raw: string): string {
  // AsYouType with default region BY; user pasting +7/+380 is handled by country-code prefix.
  return new AsYouType("BY").input(raw);
}

export function ContactStep() {
  const { draft, patch, goBack, goNext } = useBookingStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const yachtCapacity = (() => {
    if (draft.yachtSlug === "any" || !draft.yachtSlug) return 12;
    const y = YACHTS.find((x) => x.slug === draft.yachtSlug);
    return y?.capacity ?? 12;
  })();

  const { register, handleSubmit, control, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      name: draft.contact.name ?? "",
      phone: draft.contact.phone ?? "",
      preferredContact: draft.contact.preferredContact ?? "telegram",
      email: draft.contact.email ?? "",
      guests: draft.guests ?? 2,
      comment: draft.contact.comment ?? "",
    },
  });

  const preferred = useWatch({ control, name: "preferredContact" });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setServerError(null);
    const toValidate: ContactStepValues = {
      name: values.name,
      phone: values.phone,
      preferredContact: values.preferredContact,
      guests: Number(values.guests),
      email: values.email || undefined,
      comment: values.comment || undefined,
    };
    const result = contactStepSchema.safeParse(toValidate);
    if (!result.success) {
      const first = result.error.issues[0];
      setServerError(first?.message ?? "Заполните все обязательные поля");
      return;
    }
    patch({
      contact: {
        name: result.data.name,
        phone: result.data.phone,
        preferredContact: result.data.preferredContact,
        email: result.data.email,
        comment: result.data.comment,
      },
      guests: result.data.guests,
    });
    goNext();
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={formStyles.stepTitle}>Как с вами связаться?</h2>
      <p className={formStyles.stepLead}>
        Напишем или позвоним в течение 30 минут — подтвердим слот и рассчитаем цену.
      </p>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="bk-name">
          Имя
        </label>
        <input
          id="bk-name"
          className={`${styles.input} ${formState.errors.name ? styles.inputError : ""}`}
          type="text"
          autoComplete="name"
          placeholder="Анна"
          {...register("name", { required: true, minLength: 2 })}
        />
        {formState.errors.name && <span className={styles.errorMsg}>Минимум 2 символа</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="bk-phone">
          Телефон
        </label>
        <input
          id="bk-phone"
          className={`${styles.input} ${formState.errors.phone ? styles.inputError : ""}`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+375 29 123-45-67"
          {...register("phone", { required: true })}
          onChange={(e) => setValue("phone", formatPhone(e.target.value))}
        />
        {formState.errors.phone && (
          <span className={styles.errorMsg}>Нужен корректный номер с кодом страны</span>
        )}
      </div>

      <div>
        <span className={chipStyles.fieldLabel}>Куда удобнее писать?</span>
        <div className={chipStyles.chips} role="radiogroup" aria-label="Канал связи">
          {CONTACT_OPTIONS.map((opt) => {
            const isActive = preferred === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`${chipStyles.chip} ${isActive ? chipStyles.chipSelected : ""}`}
                onClick={() => setValue("preferredContact", opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bk-email">
            Email (если нужно подтверждение)
          </label>
          <input
            id="bk-email"
            className={styles.input}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="anna@example.com"
            {...register("email")}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bk-guests">
            Гостей
          </label>
          <input
            id="bk-guests"
            className={styles.counter}
            type="number"
            min={1}
            max={yachtCapacity}
            {...register("guests", { valueAsNumber: true, required: true, min: 1 })}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="bk-comment">
          Комментарий
        </label>
        <textarea
          id="bk-comment"
          className={styles.textarea}
          rows={3}
          placeholder="Повод, пожелания, вопросы"
          {...register("comment", { maxLength: 500 })}
        />
      </div>

      {serverError && (
        <p role="alert" className={styles.errorMsg}>
          {serverError}
        </p>
      )}

      <WizardNav onBack={goBack} nextType="submit" />
    </form>
  );
}

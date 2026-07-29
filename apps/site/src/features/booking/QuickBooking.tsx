"use client";

import { BookingNotConfiguredError, submitBooking } from "@/shared/lib/booking/submit";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { DatePicker } from "@/shared/ui/date-picker/DatePicker";
import { Select } from "@/shared/ui/select/Select";
import { useId, useState } from "react";
import styles from "./QuickBooking.module.scss";

// Lightweight booking form for one yacht — same fields as the home page
// BookingCTASection (date · time · name · phone → submitBooking), but new and
// scoped to a fixed yacht. Used inline (desktop yacht card) and in the panel
// popup (mobile). Не путать с мульти-степ wizard BookingForm.

const TIME_OPTIONS = [
  { value: "10:00", label: "Утро · 10:00" },
  { value: "14:00", label: "День · 14:00" },
  { value: "17:00", label: "Вечер · 17:00" },
  { value: "custom", label: "Обсудим время" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function QuickBooking({ yacht }: { yacht: { name: string } }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [time, setTime] = useState("14:00");
  const [date, setDate] = useState("");
  const [consent, setConsent] = useState(false);

  const timeName = TIME_OPTIONS.find((t) => t.value === time)?.label ?? time;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("submitting");
    try {
      await submitBooking({
        yacht: yacht.name,
        date,
        time: timeName,
        name: String(fd.get("name") ?? "").trim(),
        phone: String(fd.get("phone") ?? "").trim(),
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof BookingNotConfiguredError
          ? "Онлайн-заявка ещё настраивается. Позвоните, пожалуйста, — ответим сразу."
          : "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon} aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <p className={styles.successTitle}>Заявка принята</p>
        <p className={styles.successText}>
          Перезвоним в течение 30 минут, подтвердим свободное окно и зафиксируем бронь.
        </p>
        <button type="button" className={styles.successReset} onClick={() => setStatus("idle")}>
          ← Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${uid}-date`}>
            Дата
          </label>
          <DatePicker id={`${uid}-date`} ariaLabel="Дата" value={date} onChange={setDate} />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${uid}-time`}>
            Время
          </label>
          <Select
            id={`${uid}-time`}
            ariaLabel="Время"
            value={time}
            onValueChange={setTime}
            options={TIME_OPTIONS}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${uid}-name`}>
          Имя
        </label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          className={styles.input}
          placeholder="Как к вам обращаться"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${uid}-phone`}>
          Телефон
        </label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          className={styles.input}
          placeholder="+375 __ ___ __ __"
          required
        />
      </div>

      {status === "error" && (
        <p className={styles.error} role="alert">
          {errorMsg}{" "}
          <a href="tel:+375296953636" className={styles.errorPhone}>
            +375&nbsp;29&nbsp;695&nbsp;36&nbsp;36
          </a>
        </p>
      )}

      <Checkbox id={`${uid}-consent`} checked={consent} onCheckedChange={setConsent}>
        Согласен на обработку персональных данных. Без спама — звоним только по вашей заявке.
      </Checkbox>

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "submitting" || !consent}
      >
        {status === "submitting" ? "Отправляем…" : "Забронировать"}
      </button>
    </form>
  );
}

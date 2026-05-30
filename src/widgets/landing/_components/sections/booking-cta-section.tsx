"use client";

import { YACHTS } from "@/shared/content/yachts";
import { BookingNotConfiguredError, submitBooking } from "@/shared/lib/booking/submit";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { DatePicker } from "@/shared/ui/date-picker/DatePicker";
import { Select } from "@/shared/ui/select/Select";
import { useStickyCta } from "@/shared/ui/sticky-cta/StickyCtaContext";
import { useRef, useState } from "react";
import styles from "./booking-cta-section.module.scss";

const YACHT_OPTIONS = [
  { value: "any", label: "Любая / подберите" },
  ...YACHTS.map((y) => ({ value: y.slug, label: `${y.name} · ${y.capacity} чел` })),
];

// Простой выбор времени выхода — без калькулятора длительности (правка F:
// бронь = дата·время·яхта, цена почасовая «от X», точную называет менеджер).
const TIME_OPTIONS = [
  { value: "10:00", label: "Утро · 10:00" },
  { value: "14:00", label: "День · 14:00" },
  { value: "17:00", label: "Вечер · 17:00" },
  { value: "custom", label: "Обсудим время" },
];

type Status = "idle" | "submitting" | "success" | "error";

const POINTS = [
  "Перезвоним в течение 30 минут",
  "Бронь по предоплате 30%, остаток — в день выхода",
  "Капитан и топливо уже в цене, минимум 1 час",
];

export function BookingCTASection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [yacht, setYacht] = useState("any");
  const [time, setTime] = useState("14:00");
  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [consent, setConsent] = useState(false);

  const yachtName =
    yacht === "any" ? "Любая яхта" : (YACHTS.find((y) => y.slug === yacht)?.name ?? yacht);
  const timeName = TIME_OPTIONS.find((t) => t.value === time)?.label ?? time;

  // Page-level CTA — submits the form. Hidden once the form has succeeded.
  const sectionRef = useStickyCta(
    "booking",
    status === "success"
      ? null
      : {
          label: status === "submitting" ? "Отправляем…" : "Отправить заявку",
          note: "Капитан и топливо в цене",
          icon: "check",
          disabled: !consent || status === "submitting",
          onClick: () => formRef.current?.requestSubmit(),
        },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      yacht: yachtName,
      date,
      time: timeName,
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
    };

    setStatus("submitting");
    try {
      await submitBooking(payload);
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

  return (
    <section className={styles.section} id="booking" ref={sectionRef}>
      <div className={styles.horizon} aria-hidden="true" />

      <div className={styles.grid}>
        <div className={styles.pitch}>
          <p className={styles.eyebrow}>07 · Бронирование</p>
          <h2 className={styles.title}>
            Готовы <span className={styles.accent}>выйти в море?</span>
          </h2>
          <p className={styles.sub}>
            Выберите яхту, дату и удобное время — остальное подскажем сами. Ответим за 30 минут,
            подтвердим свободное окно и зафиксируем бронь.
          </p>
          <ul className={styles.points}>
            {POINTS.map((p) => (
              <li key={p} className={styles.point}>
                <span className={styles.pointDot} aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <a href="tel:+375296953636" className={styles.phone}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +375 29 695 36 36
          </a>
        </div>

        <div className={styles.cardWrap}>
          <div className={styles.card}>
            {status === "success" ? (
              <div className={styles.success}>
                <span className={styles.successIcon} aria-hidden="true">
                  <svg
                    width="26"
                    height="26"
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
                <h3 className={styles.successTitle}>Заявка принята</h3>
                <p className={styles.successText}>
                  Перезвоним в течение 30 минут, подтвердим свободное окно и зафиксируем бронь.
                  Хорошего дня на воде!
                </p>
                <button
                  type="button"
                  className={styles.successReset}
                  onClick={() => setStatus("idle")}
                >
                  ← Отправить ещё одну
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="bk-yacht">
                      Яхта
                    </label>
                    <Select
                      id="bk-yacht"
                      ariaLabel="Яхта"
                      value={yacht}
                      onValueChange={setYacht}
                      options={YACHT_OPTIONS}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="bk-date">
                      Дата
                    </label>
                    <DatePicker id="bk-date" ariaLabel="Дата" value={date} onChange={setDate} />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="bk-time">
                      Время
                    </label>
                    <Select
                      id="bk-time"
                      ariaLabel="Время"
                      value={time}
                      onValueChange={setTime}
                      options={TIME_OPTIONS}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="bk-name">
                      Имя
                    </label>
                    <input
                      id="bk-name"
                      name="name"
                      type="text"
                      className={styles.input}
                      placeholder="Как к вам обращаться"
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bk-phone">
                    Телефон
                  </label>
                  <input
                    id="bk-phone"
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

                <Checkbox id="bk-consent" checked={consent} onCheckedChange={setConsent}>
                  Согласен на обработку персональных данных. Без спама — звоним только по вашей
                  заявке.
                </Checkbox>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={status === "submitting" || !consent}
                >
                  {status === "submitting" ? "Отправляем…" : "Отправить заявку"}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

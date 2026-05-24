"use client";

import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { BookingNotConfiguredError, submitBooking } from "@/shared/lib/booking/submit";
import { useState } from "react";
import styles from "./booking-cta-section.module.scss";

const DURATIONS = ["2 часа", "4 часа", "День", "Вечер / ночь"];

type Status = "idle" | "submitting" | "success" | "error";

const POINTS = [
  "Перезвоним в течение 30 минут",
  "Бронь по предоплате 30%, остаток — в день выхода",
  "Капитан и топливо уже в цене",
];

export function BookingCTASection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const yachtVal = String(fd.get("yacht") ?? "any");
    const serviceVal = String(fd.get("service") ?? "walk");
    const payload = {
      yacht:
        yachtVal === "any"
          ? "Любая / подберите"
          : (YACHTS.find((y) => y.slug === yachtVal)?.name ?? yachtVal),
      service:
        serviceVal === "walk"
          ? "Просто прогулка"
          : (SERVICES.find((s) => s.slug === serviceVal)?.shortTitle ?? serviceVal),
      duration: String(fd.get("duration") ?? ""),
      date: String(fd.get("date") ?? ""),
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
    <section className={styles.section} id="booking">
      <div className={styles.horizon} aria-hidden="true" />

      <div className={styles.grid}>
        <div className={styles.pitch}>
          <p className={styles.eyebrow}>06 · Бронирование</p>
          <h2 className={styles.title}>
            Готовы <span className={styles.accent}>выйти в море?</span>
          </h2>
          <p className={styles.sub}>
            Оставьте заявку — подберём свободное окно под вашу дату и повод. Или позвоните,
            договоримся за пару минут.
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
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bk-yacht">
                    Яхта
                  </label>
                  <select id="bk-yacht" name="yacht" className={styles.select} defaultValue="any">
                    <option value="any">Любая / подберите</option>
                    {YACHTS.map((y) => (
                      <option key={y.slug} value={y.slug}>
                        {y.name} · {y.capacity} чел
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bk-service">
                    Повод
                  </label>
                  <select
                    id="bk-service"
                    name="service"
                    className={styles.select}
                    defaultValue="walk"
                  >
                    <option value="walk">Просто прогулка</option>
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.shortTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Длительность</span>
                <div className={styles.chips}>
                  {DURATIONS.map((d, i) => (
                    <label key={d} className={styles.chip}>
                      <input type="radio" name="duration" value={d} defaultChecked={i === 0} />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bk-date">
                    Дата
                  </label>
                  <input id="bk-date" name="date" type="date" className={styles.input} />
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

              <button type="submit" className={styles.submit} disabled={status === "submitting"}>
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
              <p className={styles.note}>
                Нажимая «Отправить», вы соглашаетесь с обработкой данных. Без спама — только по
                вашей заявке.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

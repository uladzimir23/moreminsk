"use client";

import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { BookingNotConfiguredError, submitBooking } from "@/shared/lib/booking/submit";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { DatePicker } from "@/shared/ui/date-picker/DatePicker";
import { Select } from "@/shared/ui/select/Select";
import { Tooltip } from "@/shared/ui/tooltip/Tooltip";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import styles from "./booking-cta-section.module.scss";

const YACHT_OPTIONS = [
  { value: "any", label: "Любая / подберите" },
  ...YACHTS.map((y) => ({ value: y.slug, label: `${y.name} · ${y.capacity} чел` })),
];
const OCCASION_OPTIONS = [
  { value: "walk", label: "Просто прогулка" },
  ...SERVICES.map((s) => ({ value: s.slug, label: s.shortTitle })),
];

type Status = "idle" | "submitting" | "success" | "error";

// «Просто прогулка» has no service package — it's priced by the yacht's hourly
// rate × hours. Services carry their own approved package prices.
type Pkg = { name: string; duration: string; hours: number; price?: number };

const WALK_PACKAGES: ReadonlyArray<Pkg> = [
  { name: "Прогулка", duration: "2 часа", hours: 2 },
  { name: "Прогулка", duration: "4 часа", hours: 4 },
  { name: "Вечер", duration: "6 часов", hours: 6 },
];

// Lowest hourly across the fleet — used when «любая яхта» is picked.
const MIN_RATE = Math.min(...YACHTS.map((y) => y.pricePerHour));

const POINTS = [
  "Перезвоним в течение 30 минут",
  "Бронь по предоплате 30%, остаток — в день выхода",
  "Капитан и топливо уже в цене",
];

export function BookingCTASection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Calculator state ──────────────────────────────────────────────────────
  const [yacht, setYacht] = useState("any");
  const [occasion, setOccasion] = useState("walk"); // "walk" | service.slug
  const [pkgIdx, setPkgIdx] = useState(0);
  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [consent, setConsent] = useState(false);

  const service = occasion === "walk" ? null : SERVICES.find((s) => s.slug === occasion);
  const packages: ReadonlyArray<Pkg> = service
    ? service.packages.map((p) => ({
        name: p.name,
        duration: p.duration,
        hours: 0,
        price: p.price,
      }))
    : WALK_PACKAGES;
  const pkg = packages[Math.min(pkgIdx, packages.length - 1)] ?? packages[0];

  const yachtRate =
    yacht === "any" ? MIN_RATE : (YACHTS.find((y) => y.slug === yacht)?.pricePerHour ?? MIN_RATE);
  // Service packages are fixed; a plain walk is hourly rate × hours. (Trivial —
  // the React Compiler memoizes it; no manual useMemo.)
  const price = service ? (pkg.price ?? 0) : pkg.hours * yachtRate;

  const yachtName =
    yacht === "any" ? "Любая яхта" : (YACHTS.find((y) => y.slug === yacht)?.name ?? yacht);
  const occasionName = service ? service.shortTitle : "Прогулка";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      yacht: yachtName,
      service: occasionName,
      duration: pkg.duration,
      price: `${price} BYN`,
      date,
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
            Соберите выход в калькуляторе — цена обновится сразу. Это ориентир: точную стоимость
            подтвердим при звонке под вашу дату и состав.
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
                  <Select
                    id="bk-yacht"
                    ariaLabel="Яхта"
                    value={yacht}
                    onValueChange={setYacht}
                    options={YACHT_OPTIONS}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bk-service">
                    Повод
                  </label>
                  <Select
                    id="bk-service"
                    ariaLabel="Повод"
                    value={occasion}
                    onValueChange={(v) => {
                      setOccasion(v);
                      setPkgIdx(0);
                    }}
                    options={OCCASION_OPTIONS}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Длительность</span>
                <div className={styles.chips}>
                  {packages.map((p, i) => (
                    <label key={`${p.name}-${p.duration}`} className={styles.chip}>
                      <input
                        type="radio"
                        name="duration"
                        checked={pkgIdx === i}
                        onChange={() => setPkgIdx(i)}
                      />
                      <span>{p.duration}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Live calculator output ─────────────────────────────────── */}
              <div className={styles.pricePanel} aria-live="polite">
                <span className={styles.priceMeta}>
                  {yachtName} · {occasionName} · {pkg.duration}
                </span>
                <span className={styles.priceRow}>
                  <span className={styles.priceLabel}>
                    Ориентир
                    <Tooltip content="Предварительный расчёт. Точную цену подтвердим при звонке — под вашу дату, состав и доп. пожелания.">
                      <button
                        type="button"
                        className={styles.hint}
                        aria-label="Что значит ориентир"
                      >
                        <HelpCircle size={14} aria-hidden="true" />
                      </button>
                    </Tooltip>
                  </span>
                  <span className={styles.priceValue}>
                    {price.toLocaleString("ru-RU")}
                    <span className={styles.priceUnit}>BYN</span>
                  </span>
                </span>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="bk-date">
                    Дата
                  </label>
                  <DatePicker id="bk-date" ariaLabel="Дата" value={date} onChange={setDate} />
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
    </section>
  );
}

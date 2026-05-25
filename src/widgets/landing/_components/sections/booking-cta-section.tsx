"use client";

import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { BookingNotConfiguredError, submitBooking } from "@/shared/lib/booking/submit";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { DatePicker } from "@/shared/ui/date-picker/DatePicker";
import { HoursDial } from "@/shared/ui/hours-dial/HoursDial";
import { Select } from "@/shared/ui/select/Select";
import { useStickyCta } from "@/shared/ui/sticky-cta/StickyCtaContext";
import { Tooltip } from "@/shared/ui/tooltip/Tooltip";
import clsx from "clsx";
import { HelpCircle } from "lucide-react";
import { useRef, useState } from "react";
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

// Lowest hourly across the fleet — used when «любая яхта» is picked.
const MIN_RATE = Math.min(...YACHTS.map((y) => y.pricePerHour));
const WALK_MIN_H = 1;
const WALK_MAX_H = 8;

const POINTS = [
  "Перезвоним в течение 30 минут",
  "Бронь по предоплате 30%, остаток — в день выхода",
  "Капитан и топливо уже в цене",
];

export function BookingCTASection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // ── Calculator state ──────────────────────────────────────────────────────
  const [yacht, setYacht] = useState("any");
  const [occasion, setOccasion] = useState("walk"); // "walk" | service.slug
  const [pkgIdx, setPkgIdx] = useState(0);
  const [hours, setHours] = useState(2); // walk only — driven by the helm dial
  const [date, setDate] = useState(""); // "YYYY-MM-DD"
  const [consent, setConsent] = useState(false);

  // Services carry fixed approved packages (picked by chips); «просто прогулка»
  // is hourly — the helm dial sets the hours, priced at the yacht's rate.
  const service = occasion === "walk" ? null : SERVICES.find((s) => s.slug === occasion);
  const packages = service ? service.packages : [];
  const pkg = service ? (packages[Math.min(pkgIdx, packages.length - 1)] ?? packages[0]) : null;

  const yachtRate =
    yacht === "any" ? MIN_RATE : (YACHTS.find((y) => y.slug === yacht)?.pricePerHour ?? MIN_RATE);
  const price = pkg ? pkg.price : hours * yachtRate;
  const durationLabel = pkg ? pkg.duration : `${hours} ч`;
  // Hours the decorative helm reflects (service → its package's hours).
  const durationHours = pkg ? Number.parseInt(pkg.duration, 10) || 2 : hours;

  const yachtName =
    yacht === "any" ? "Любая яхта" : (YACHTS.find((y) => y.slug === yacht)?.name ?? yacht);
  const occasionName = service ? service.shortTitle : "Прогулка";

  // Page-level CTA — submits the form and carries the live price. Hidden once
  // the form has succeeded (the thank-you state takes over).
  const sectionRef = useStickyCta(
    "booking",
    status === "success"
      ? null
      : {
          label: status === "submitting" ? "Отправляем…" : "Отправить заявку",
          note: `${price.toLocaleString("ru-RU")} BYN`,
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
      service: occasionName,
      duration: durationLabel,
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
    <section className={styles.section} id="booking" ref={sectionRef}>
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

        <div className={styles.cardWrap}>
          <HoursDial
            value={durationHours}
            interactive={false}
            min={WALK_MIN_H}
            max={WALK_MAX_H}
            className={styles.bgWheel}
          />
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
                  {service ? (
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
                  ) : (
                    <div className={styles.hours}>
                      <div className={styles.presets}>
                        {[2, 4, 6, 8].map((h) => (
                          <button
                            key={h}
                            type="button"
                            className={clsx(styles.preset, hours === h && styles.presetActive)}
                            onClick={() => setHours(h)}
                          >
                            {h === 8 ? "День" : `${h} ч`}
                          </button>
                        ))}
                      </div>
                      <input
                        type="range"
                        className={styles.range}
                        min={WALK_MIN_H}
                        max={WALK_MAX_H}
                        step={1}
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        aria-label="Длительность, часов"
                        style={
                          {
                            "--fill": `${((hours - WALK_MIN_H) / (WALK_MAX_H - WALK_MIN_H)) * 100}%`,
                          } as React.CSSProperties
                        }
                      />
                      <div className={styles.rangeEnds}>
                        <span>{WALK_MIN_H} ч</span>
                        <span className={styles.rangeNow}>{hours} ч</span>
                        <span>{WALK_MAX_H} ч</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Live calculator output ─────────────────────────────────── */}
                <div className={styles.pricePanel} aria-live="polite">
                  <span className={styles.priceMeta}>
                    {yachtName} · {occasionName} · {durationLabel}
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
      </div>
    </section>
  );
}

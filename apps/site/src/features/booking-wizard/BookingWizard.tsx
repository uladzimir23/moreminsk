"use client";

import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { withBase } from "@/shared/lib/base-path";
import { submitBooking } from "@/shared/lib/booking/submit";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Calendar as CalIcon, Check, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DAY_END,
  DAY_START,
  fetchBusyForDay,
  fetchBusyForRange,
  hasFreeInterval,
  isHourBusy,
  isRangeFree,
  resolveYachtId,
  type SlotBusy,
} from "./availability";
import styles from "./BookingWizard.module.scss";

// Booking wizard: reason (опц.) → yacht → date → time+duration → contacts → done.
// Live-availability из PB view; сабмит через submitBooking (leads + hooks).

type Step = "reason" | "yacht" | "date" | "time" | "contacts" | "done";
const STEP_ORDER: Step[] = ["reason", "yacht", "date", "time", "contacts", "done"];
const LABELS: Record<Step, string> = {
  reason: "Повод",
  yacht: "Яхта",
  date: "Дата",
  time: "Время",
  contacts: "Контакты",
  done: "Готово",
};

const DURATION_PRESETS = [1, 2, 3, 4, 6, 12] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

type State = {
  reasonSlug?: string;
  reasonTitle?: string;
  yachtSlug?: string;
  date?: string; // YYYY-MM-DD
  startHour?: number;
  duration?: number;
  name: string;
  phone: string;
  guests: number;
  comment: string;
};

const initial: State = { name: "", phone: "", guests: 2, comment: "" };

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function firstOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

export function BookingWizard() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("reason");
  const [state, setState] = useState<State>(initial);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const currentIdx = STEP_ORDER.indexOf(step);

  const yacht = state.yachtSlug ? YACHTS.find((y) => y.slug === state.yachtSlug) : undefined;
  const reason = state.reasonSlug ? SERVICES.find((s) => s.slug === state.reasonSlug) : undefined;

  // Список подходящих яхт: если выбран повод — по suitableYachts, иначе все.
  const eligibleYachts = useMemo(() => {
    if (!reason) return YACHTS;
    const set = new Set(reason.suitableYachts);
    return YACHTS.filter((y) => set.has(y.slug));
  }, [reason]);

  const goto = (s: Step) => setStep(s);
  const next = () => {
    const i = STEP_ORDER.indexOf(step);
    if (i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1]);
  };
  const back = () => {
    const i = STEP_ORDER.indexOf(step);
    if (i > 0) setStep(STEP_ORDER[i - 1]);
  };

  async function submit() {
    if (!yacht || !state.date || state.startHour == null || !state.duration) return;
    setStatus("submitting");
    try {
      await submitBooking({
        yacht: yacht.slug,
        date: state.date,
        time: `${pad(state.startHour)}:00`,
        name: state.name,
        phone: state.phone,
        service: reason?.shortTitle,
        guests: state.guests,
        durationHours: state.duration,
        priceTotal: yacht.pricePerHour * state.duration,
        comment: state.comment,
      });
      setStep("done");
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Не удалось отправить");
    }
  }

  return (
    <div className={styles.wiz}>
      <header className={styles.head}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={back}
          disabled={currentIdx === 0 || step === "done" || status === "submitting"}
          aria-label="Назад"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className={styles.stepTitle}>{LABELS[step]}</h2>
      </header>

      <div className={styles.progress}>
        {STEP_ORDER.map((s, i) => (
          <span
            key={s}
            className={`${styles.progressStep} ${i <= currentIdx ? styles.active : ""}`}
            aria-label={LABELS[s]}
          />
        ))}
      </div>

      <div className={styles.body}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className={styles.stepWrap}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {step === "reason" && (
              <ReasonStep
                onPick={(s) => {
                  setState((st) => ({
                    ...st,
                    reasonSlug: s?.slug,
                    reasonTitle: s?.shortTitle,
                    // Сбрасываем выбор яхты если она стала неподходящей
                    yachtSlug:
                      s && st.yachtSlug && !s.suitableYachts.includes(st.yachtSlug)
                        ? undefined
                        : st.yachtSlug,
                  }));
                  goto("yacht");
                }}
                onSkip={() => {
                  setState((st) => ({ ...st, reasonSlug: undefined, reasonTitle: undefined }));
                  goto("yacht");
                }}
              />
            )}
            {step === "yacht" && (
              <YachtStep
                yachts={eligibleYachts}
                selected={state.yachtSlug}
                onPick={(slug) => {
                  setState((st) => ({ ...st, yachtSlug: slug }));
                  goto("date");
                }}
              />
            )}
            {step === "date" && yacht && (
              <DateStep
                yachtSlug={yacht.slug}
                minHours={yacht.minHours}
                selected={state.date}
                onPick={(d) => {
                  setState((st) => ({ ...st, date: d, startHour: undefined, duration: undefined }));
                  goto("time");
                }}
              />
            )}
            {step === "time" && yacht && state.date && (
              <TimeStep
                yachtSlug={yacht.slug}
                pricePerHour={yacht.pricePerHour}
                minHours={yacht.minHours}
                date={state.date}
                startHour={state.startHour}
                duration={state.duration}
                onChange={(startHour, duration) =>
                  setState((st) => ({ ...st, startHour, duration }))
                }
                onNext={next}
              />
            )}
            {step === "contacts" && yacht && (
              <ContactsStep
                state={state}
                yachtName={yacht.name}
                priceTotal={state.duration ? yacht.pricePerHour * state.duration : 0}
                submitting={status === "submitting"}
                error={status === "error" ? errorMsg : ""}
                onChange={(patch) => setState((st) => ({ ...st, ...patch }))}
                onSubmit={submit}
              />
            )}
            {step === "done" &&
              yacht &&
              state.date &&
              state.startHour != null &&
              state.duration && (
                <DoneStep
                  yachtName={yacht.name}
                  date={state.date}
                  startHour={state.startHour}
                  duration={state.duration}
                  onReset={() => {
                    setState(initial);
                    setStep("reason");
                  }}
                />
              )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step: reason ────────────────────────────────────────────────────────
function ReasonStep({
  onPick,
  onSkip,
}: {
  onPick: (s: (typeof SERVICES)[number] | null) => void;
  onSkip: () => void;
}) {
  // Только «поводы», не «типы прогулок»: свадба, ДР, девичник, свидание, фотосессия
  const REASONS = SERVICES.filter((s) =>
    [
      "svidanie",
      "den-rozhdeniya",
      "devichnik",
      "korporativ",
      "fotosessiya",
      "master-klass",
    ].includes(s.slug),
  );
  return (
    <>
      <p className={styles.stepHint}>Под какой повод? — подберём подходящие яхты.</p>
      <div className={styles.reasonGrid}>
        {REASONS.map((s) => (
          <button
            key={s.slug}
            type="button"
            className={styles.reasonCard}
            onClick={() => onPick(s)}
          >
            <span className={styles.reasonTitle}>{s.shortTitle}</span>
            <span className={styles.reasonUtp}>{s.utp}</span>
          </button>
        ))}
      </div>
      <button type="button" className={styles.skipBtn} onClick={onSkip}>
        Просто прокатиться — пропустить
      </button>
    </>
  );
}

// ─── Step: yacht ─────────────────────────────────────────────────────────
function YachtStep({
  yachts,
  selected,
  onPick,
}: {
  yachts: typeof YACHTS;
  selected?: string;
  onPick: (slug: string) => void;
}) {
  return (
    <>
      <p className={styles.stepHint}>Выберите яхту:</p>
      <div className={styles.yachtGrid}>
        {yachts.map((y) => (
          <button
            key={y.slug}
            type="button"
            className={`${styles.yachtCard} ${selected === y.slug ? styles.selected : ""}`}
            onClick={() => onPick(y.slug)}
          >
            {y.mainImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={styles.yachtImg}
                src={withBase(y.mainImage)}
                alt=""
                aria-hidden="true"
              />
            )}
            <div className={styles.yachtInfo}>
              <span className={styles.yachtName}>{y.name}</span>
              <span className={styles.yachtMeta}>
                до {y.capacity} гостей · от {y.pricePerHour} BYN/ч · мин. {y.minHours} ч
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ─── Step: date ──────────────────────────────────────────────────────────
function DateStep({
  yachtSlug,
  minHours,
  selected,
  onPick,
}: {
  yachtSlug: string;
  minHours: number;
  selected?: string;
  onPick: (date: string) => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [monthOffset, setMonthOffset] = useState(0);
  const [busyByDate, setBusyByDate] = useState<Record<string, SlotBusy[]>>({});

  const monthDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1),
    [monthOffset, today],
  );
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const yachtId = await resolveYachtId(yachtSlug);
      if (!yachtId) return;
      const from = ymd(new Date(y, m, 1));
      const to = ymd(new Date(y, m, daysInMonth(y, m)));
      const data = await fetchBusyForRange(yachtId, from, to);
      if (!cancelled) setBusyByDate(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [yachtSlug, y, m]);

  // Первый день месяца — какой день недели (Пн=0..Вс=6)
  const firstDow = (firstOfMonth(monthDate).getDay() + 6) % 7;
  const totalDays = daysInMonth(y, m);
  const cells: Array<{ date?: Date; empty?: true }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({ empty: true });
  for (let d = 1; d <= totalDays; d++) cells.push({ date: new Date(y, m, d) });

  const monthName = monthDate.toLocaleDateString("ru", { month: "long", year: "numeric" });

  return (
    <>
      <div className={styles.calHead}>
        <button
          type="button"
          className={styles.calNav}
          onClick={() => setMonthOffset((n) => Math.max(0, n - 1))}
          disabled={monthOffset === 0}
        >
          ←
        </button>
        <span className={styles.calMonth}>{monthName}</span>
        <button
          type="button"
          className={styles.calNav}
          onClick={() => setMonthOffset((n) => Math.min(5, n + 1))}
          disabled={monthOffset >= 5}
        >
          →
        </button>
      </div>
      <div className={styles.calWeekHead}>
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className={styles.calGrid}>
        {cells.map((c, i) => {
          if (c.empty) return <span key={i} className={styles.calCellEmpty} />;
          const d = c.date!;
          const iso = ymd(d);
          const inPast = d < today;
          const busy = busyByDate[iso] ?? [];
          const noSpace = !inPast && !hasFreeInterval(busy, minHours);
          const disabled = inPast || noSpace;
          const isSelected = iso === selected;
          const isToday = ymd(today) === iso;
          return (
            <button
              key={iso}
              type="button"
              className={`${styles.calCell} ${disabled ? styles.disabled : ""} ${isSelected ? styles.selected : ""} ${isToday ? styles.today : ""}`}
              disabled={disabled}
              onClick={() => onPick(iso)}
              aria-label={d.toLocaleDateString("ru", { day: "numeric", month: "long" })}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <p className={styles.stepHint}>
        Серым — прошедшие или полностью занятые дни (нет свободных {minHours}+ ч подряд).
      </p>
    </>
  );
}

// ─── Step: time + duration ───────────────────────────────────────────────
function TimeStep({
  yachtSlug,
  pricePerHour,
  minHours,
  date,
  startHour,
  duration,
  onChange,
  onNext,
}: {
  yachtSlug: string;
  pricePerHour: number;
  minHours: number;
  date: string;
  startHour?: number;
  duration?: number;
  onChange: (startHour: number, duration: number) => void;
  onNext: () => void;
}) {
  const [busy, setBusy] = useState<SlotBusy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const yachtId = await resolveYachtId(yachtSlug);
      if (!yachtId) {
        if (!cancelled) {
          setBusy([]);
          setLoading(false);
        }
        return;
      }
      const list = await fetchBusyForDay(yachtId, date);
      if (!cancelled) {
        setBusy(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [yachtSlug, date]);

  const hours = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i);
  const validDurations = DURATION_PRESETS.filter((d) => d >= minHours);

  function pickHour(h: number) {
    const d = duration ?? minHours;
    if (isRangeFree(busy, h, h + d)) onChange(h, d);
    else onChange(h, minHours); // fallback: минимум
  }
  function pickDuration(d: number) {
    if (startHour == null) return;
    if (isRangeFree(busy, startHour, startHour + d)) onChange(startHour, d);
  }

  const canProceed =
    startHour != null && duration != null && isRangeFree(busy, startHour, startHour + duration);

  const total = duration ? pricePerHour * duration : 0;

  return (
    <>
      <p className={styles.stepHint}>Начало:</p>
      <div className={styles.hourGrid}>
        {hours.map((h) => {
          const bs = isHourBusy(busy, h);
          const selected = startHour === h;
          return (
            <button
              key={h}
              type="button"
              className={`${styles.hourBtn} ${bs ? styles.busy : ""} ${selected ? styles.selected : ""}`}
              disabled={bs || loading}
              onClick={() => pickHour(h)}
            >
              {pad(h)}:00
            </button>
          );
        })}
      </div>

      {startHour != null && (
        <>
          <p className={styles.stepHint}>Длительность:</p>
          <div className={styles.durGrid}>
            {validDurations.map((d) => {
              const fits = isRangeFree(busy, startHour, startHour + d) && startHour + d <= DAY_END;
              const selected = duration === d;
              return (
                <button
                  key={d}
                  type="button"
                  className={`${styles.durBtn} ${!fits ? styles.busy : ""} ${selected ? styles.selected : ""}`}
                  disabled={!fits}
                  onClick={() => pickDuration(d)}
                >
                  {d === 12 ? "весь день" : `${d} ч`}
                </button>
              );
            })}
          </div>
        </>
      )}

      {startHour != null && duration != null && (
        <div className={styles.priceBox}>
          <span className={styles.priceLabel}>
            {pad(startHour)}:00 — {pad(startHour + duration)}:00 · {duration} ч
          </span>
          <span className={styles.priceVal}>{total} BYN</span>
        </div>
      )}

      <button type="button" className={styles.primary} onClick={onNext} disabled={!canProceed}>
        Продолжить
      </button>
    </>
  );
}

// ─── Step: contacts ──────────────────────────────────────────────────────
function ContactsStep({
  state,
  yachtName,
  priceTotal,
  submitting,
  error,
  onChange,
  onSubmit,
}: {
  state: State;
  yachtName: string;
  priceTotal: number;
  submitting: boolean;
  error: string;
  onChange: (patch: Partial<State>) => void;
  onSubmit: () => void;
}) {
  const [consent, setConsent] = useState(false);
  return (
    <>
      <div className={styles.recap}>
        <span className={styles.recapChip}>{yachtName}</span>
        {state.reasonTitle && <span className={styles.recapChip}>{state.reasonTitle}</span>}
        {state.date && <span className={styles.recapChip}>{state.date}</span>}
        {state.startHour != null && state.duration && (
          <span className={styles.recapChip}>
            {pad(state.startHour)}:00 · {state.duration} ч
          </span>
        )}
        <span className={styles.recapPrice}>{priceTotal} BYN</span>
      </div>

      <label className={styles.field}>
        <span className={styles.fieldLbl}>Имя</span>
        <input
          type="text"
          className={styles.input}
          value={state.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Как к вам обращаться"
          required
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLbl}>Телефон</span>
        <input
          type="tel"
          className={styles.input}
          value={state.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+375 __ ___ __ __"
          required
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLbl}>
          Гостей <Users size={13} aria-hidden="true" />
        </span>
        <input
          type="number"
          min={1}
          max={20}
          className={styles.input}
          value={state.guests}
          onChange={(e) => onChange({ guests: Math.max(1, parseInt(e.target.value) || 1) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLbl}>Комментарий (необязательно)</span>
        <textarea
          className={styles.input}
          rows={2}
          value={state.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
          placeholder="Особые пожелания, торт, шампанское…"
        />
      </label>

      <label className={styles.consentRow}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>Согласен на обработку персональных данных. Без спама.</span>
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="button"
        className={styles.primary}
        onClick={onSubmit}
        disabled={submitting || !consent || !state.name.trim() || state.phone.trim().length < 6}
      >
        {submitting ? "Отправляем…" : "Отправить заявку"}
      </button>
    </>
  );
}

// ─── Step: done ──────────────────────────────────────────────────────────
function DoneStep({
  yachtName,
  date,
  startHour,
  duration,
  onReset,
}: {
  yachtName: string;
  date: string;
  startHour: number;
  duration: number;
  onReset: () => void;
}) {
  const startISO = `${date}T${pad(startHour)}:00:00`;
  const startDate = new Date(startISO);
  const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")
      .slice(0, 15);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//moreminsk//booking//RU",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(startDate)}`,
    `DTEND:${fmt(endDate)}`,
    `SUMMARY:Море Minsk — ${yachtName}`,
    "LOCATION:Минское море",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  const humanDate = toDate(date).toLocaleDateString("ru", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  return (
    <div className={styles.done}>
      <span className={styles.doneMark} aria-hidden="true">
        <Check size={28} />
      </span>
      <h3 className={styles.doneTitle}>Заявка принята</h3>
      <div className={styles.summary}>
        <p>
          <b>{yachtName}</b> · {humanDate}
        </p>
        <p>
          {pad(startHour)}:00 — {pad(startHour + duration)}:00 · {duration} ч
        </p>
      </div>
      <p className={styles.doneNote}>Оператор перезвонит в течение 30 минут для подтверждения.</p>
      <div className={styles.doneActions}>
        <a href={icsHref} download="moreminsk.ics" className={styles.secondary}>
          <CalIcon size={15} aria-hidden="true" />
          Добавить в календарь
        </a>
        <a href="tel:+375296953636" className={styles.secondary}>
          Позвонить сейчас
        </a>
      </div>
      <button type="button" className={styles.linkBtn} onClick={onReset}>
        Ещё одна бронь
      </button>
    </div>
  );
}

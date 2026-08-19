import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pb } from "../lib/pb";

// Календарь занятости яхт (фаза 3). Табы яхт × неделя × получасовые слоты.
// Read/write через auth-editor; сайт видит только view `availability` без PII.

type Yacht = { id: string; name: string; slug: string };

type Booking = {
  id: string;
  yacht: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string;
  status: "booked" | "blocked" | "tentative";
  client_name?: string;
  client_phone?: string;
  guests?: number;
  price_total?: number;
  prepaid?: number;
  pay_note?: string;
  source?: string;
  source_agent?: string;
  comment?: string;
  archived?: boolean;
};

// Часовые слоты 10:00 → 22:30. Получасовые — просто (h, m).
const HOURS = Array.from({ length: 13 }, (_, i) => 10 + i); // 10..22
const HALVES: Array<[number, number]> = HOURS.flatMap((h) => [
  [h, 0],
  [h, 30],
]);

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function hm(h: number, m: number) {
  return `${pad(h)}:${pad(m)}`;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function startOfWeek(d: Date) {
  const c = new Date(d);
  const day = (c.getDay() + 6) % 7; // Пн=0
  c.setDate(c.getDate() - day);
  c.setHours(0, 0, 0, 0);
  return c;
}

type SlotKey = string; // date|start
function slotKey(date: string, start: string): SlotKey {
  return `${date}|${start}`;
}

export function Bookings() {
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [yachtId, setYachtId] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ mode: "new" | "edit"; b: Partial<Booking> } | null>(
    null,
  );

  // Загрузка списка яхт
  useEffect(() => {
    pb.collection("yachts")
      .getFullList<Yacht>({ fields: "id,name,slug", sort: "name" })
      .then((ys) => {
        setYachts(ys);
        if (ys.length && !yachtId) setYachtId(ys[0].id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );
  const dateFrom = ymd(days[0]);
  const dateTo = ymd(days[6]);

  const load = useCallback(async () => {
    if (!yachtId) return;
    setLoading(true);
    try {
      const list = await pb.collection("bookings").getFullList<Booking>({
        filter: `yacht="${yachtId}" && date>="${dateFrom}" && date<="${dateTo}"`,
        sort: "date,start",
      });
      setRows(list);
    } finally {
      setLoading(false);
    }
  }, [yachtId, dateFrom, dateTo]);

  useEffect(() => {
    load();
  }, [load]);

  // Индекс slot → booking (быстрый lookup при рендере)
  const byKey = useMemo(() => {
    const m = new Map<SlotKey, Booking>();
    for (const r of rows) m.set(slotKey(r.date, r.start), r);
    return m;
  }, [rows]);

  function openNew(date: string, start: string) {
    // end = start + 30min
    const [h, mm] = start.split(":").map(Number);
    const endMinutes = h * 60 + mm + 30;
    const end = hm(Math.floor(endMinutes / 60), endMinutes % 60);
    setEditing({
      mode: "new",
      b: {
        yacht: yachtId ?? "",
        date,
        start,
        end,
        status: "booked",
        source: "manual",
      },
    });
  }

  function openEdit(b: Booking) {
    setEditing({ mode: "edit", b: { ...b } });
  }

  async function save() {
    if (!editing) return;
    const b = editing.b;
    const payload: Record<string, unknown> = {
      yacht: b.yacht,
      date: b.date,
      start: b.start,
      end: b.end,
      status: b.status ?? "booked",
      client_name: b.client_name ?? "",
      client_phone: b.client_phone ?? "",
      guests: b.guests ?? 0,
      price_total: b.price_total ?? 0,
      prepaid: b.prepaid ?? 0,
      pay_note: b.pay_note ?? "",
      source: b.source ?? "manual",
      source_agent: b.source_agent ?? "",
      comment: b.comment ?? "",
      archived: b.archived ?? false,
    };
    if (editing.mode === "new") {
      await pb.collection("bookings").create(payload);
    } else if (b.id) {
      await pb.collection("bookings").update(b.id, payload);
    }
    setEditing(null);
    await load();
  }

  async function del() {
    if (!editing || editing.mode !== "edit" || !editing.b.id) return;
    if (!confirm("Удалить бронь?")) return;
    await pb.collection("bookings").delete(editing.b.id);
    setEditing(null);
    await load();
  }

  return (
    <div className="bookings">
      <div className="bookings-head">
        <h1>Календарь</h1>
        <div className="bookings-nav">
          <button className="ghost" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            ← Неделя
          </button>
          <button className="ghost" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Сегодня
          </button>
          <button className="ghost" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            Неделя →
          </button>
          <span className="range">
            {ymd(days[0])} — {ymd(days[6])}
          </span>
        </div>
      </div>

      <div className="tabs">
        {yachts.map((y) => (
          <button
            key={y.id}
            className={`tab ${y.id === yachtId ? "active" : ""}`}
            onClick={() => setYachtId(y.id)}
          >
            {y.name}
          </button>
        ))}
      </div>

      <div className="cal-grid">
        <div className="cal-head">
          <div className="cal-col-time" />
          {days.map((d, i) => (
            <div key={i} className="cal-col-day">
              <div className="dow">{WEEKDAYS[i]}</div>
              <div className="dom">
                {d.getDate()}.{pad(d.getMonth() + 1)}
              </div>
            </div>
          ))}
        </div>
        <div className="cal-body">
          {HALVES.map(([h, m]) => {
            const start = hm(h, m);
            const isHourStart = m === 0;
            return (
              <div key={start} className={`cal-row ${isHourStart ? "hour" : "half"}`}>
                <div className="cal-time">{isHourStart ? `${pad(h)}:00` : ""}</div>
                {days.map((d) => {
                  const date = ymd(d);
                  const b = byKey.get(slotKey(date, start));
                  return (
                    <button
                      key={date}
                      type="button"
                      className={`cal-cell ${b ? `filled ${b.status}` : "empty"} ${b?.archived ? "archived" : ""}`}
                      onClick={() => (b ? openEdit(b) : openNew(date, start))}
                      title={b ? `${b.client_name || "—"} · ${b.client_phone || ""}` : ""}
                    >
                      {b && (
                        <span className="cell-body">
                          <span className="cell-name">
                            {b.client_name || (b.status === "blocked" ? "⛔" : "—")}
                          </span>
                          {b.price_total ? <span className="cell-price">{b.price_total}</span> : null}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        {loading && <div className="cal-loading">Загрузка…</div>}
      </div>

      {editing && (
        <BookingDrawer
          state={editing}
          onChange={(b) => setEditing({ ...editing, b })}
          onSave={save}
          onDelete={editing.mode === "edit" ? del : undefined}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function BookingDrawer({
  state,
  onChange,
  onSave,
  onDelete,
  onClose,
}: {
  state: { mode: "new" | "edit"; b: Partial<Booking> };
  onChange: (b: Partial<Booking>) => void;
  onSave: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onClose: () => void;
}) {
  const b = state.b;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLInputElement>("input, select, textarea")?.focus();
  }, []);
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" ref={ref}>
        <div className="drawer-head">
          <h2>{state.mode === "new" ? "Новая бронь" : "Редактирование"}</h2>
          <button className="linkbtn" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className="form">
          <div className="row-2">
            <label className="field">
              <span className="lbl">Дата</span>
              <input
                type="date"
                value={b.date ?? ""}
                onChange={(e) => onChange({ ...b, date: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="lbl">Статус</span>
              <select
                value={b.status ?? "booked"}
                onChange={(e) => onChange({ ...b, status: e.target.value as Booking["status"] })}
              >
                <option value="booked">Занято</option>
                <option value="tentative">Предв. (с сайта)</option>
                <option value="blocked">Блок (тех/погода)</option>
              </select>
            </label>
          </div>
          <div className="row-2">
            <label className="field">
              <span className="lbl">Начало</span>
              <input
                type="time"
                step={1800}
                value={b.start ?? ""}
                onChange={(e) => onChange({ ...b, start: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="lbl">Конец</span>
              <input
                type="time"
                step={1800}
                value={b.end ?? ""}
                onChange={(e) => onChange({ ...b, end: e.target.value })}
              />
            </label>
          </div>
          <label className="field">
            <span className="lbl">Имя клиента</span>
            <input
              type="text"
              value={b.client_name ?? ""}
              onChange={(e) => onChange({ ...b, client_name: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="lbl">Телефон</span>
            <input
              type="text"
              value={b.client_phone ?? ""}
              onChange={(e) => onChange({ ...b, client_phone: e.target.value })}
            />
          </label>
          <div className="row-3">
            <label className="field">
              <span className="lbl">Гостей</span>
              <input
                type="number"
                value={b.guests ?? 0}
                onChange={(e) => onChange({ ...b, guests: parseInt(e.target.value) || 0 })}
              />
            </label>
            <label className="field">
              <span className="lbl">Цена BYN</span>
              <input
                type="number"
                value={b.price_total ?? 0}
                onChange={(e) => onChange({ ...b, price_total: parseInt(e.target.value) || 0 })}
              />
            </label>
            <label className="field">
              <span className="lbl">Аванс BYN</span>
              <input
                type="number"
                value={b.prepaid ?? 0}
                onChange={(e) => onChange({ ...b, prepaid: parseInt(e.target.value) || 0 })}
              />
            </label>
          </div>
          <label className="field">
            <span className="lbl">Оплата (заметка)</span>
            <input
              type="text"
              placeholder="безнал, аванс, нал…"
              value={b.pay_note ?? ""}
              onChange={(e) => onChange({ ...b, pay_note: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="lbl">Источник-агент</span>
            <input
              type="text"
              placeholder="юность, сливки, рцоп…"
              value={b.source_agent ?? ""}
              onChange={(e) => onChange({ ...b, source_agent: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="lbl">Комментарий</span>
            <textarea
              rows={3}
              value={b.comment ?? ""}
              onChange={(e) => onChange({ ...b, comment: e.target.value })}
            />
          </label>
          <label className="field field-bool">
            <input
              type="checkbox"
              checked={!!b.archived}
              onChange={(e) => onChange({ ...b, archived: e.target.checked })}
            />
            <span className="lbl">Архивная (скрыть с публичного календаря)</span>
          </label>
        </div>
        <div className="drawer-foot">
          {onDelete && (
            <button className="ghost danger" onClick={onDelete}>
              Удалить
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="ghost" onClick={onClose}>
            Отмена
          </button>
          <button className="btn" onClick={onSave} disabled={!b.date || !b.start || !b.end}>
            Сохранить
          </button>
        </div>
      </div>
    </>
  );
}

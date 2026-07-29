import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field } from "../components/Field";
import { PhotoUploader } from "../components/PhotoUploader";
import { collectionByName, type CollectionCfg } from "../lib/collections";
import { pb } from "../lib/pb";

type Rec = Record<string, unknown>;

// Запись PB → значения формы (объекты/списки как есть, bool → boolean).
function toForm(cfg: CollectionCfg, rec: Rec | null): Rec {
  const out: Rec = {};
  for (const f of cfg.fields) {
    const v = rec?.[f.name];
    if (f.type === "group") out[f.name] = (v ?? {}) as Rec;
    else if (
      f.type === "objectList" ||
      f.type === "stringList" ||
      f.type === "photos"
    )
      out[f.name] = Array.isArray(v) ? v : [];
    else if (f.type === "bool") out[f.name] = rec ? Boolean(v) : f.name === "published";
    else if (f.type === "number") out[f.name] = v ?? null;
    else out[f.name] = v ?? "";
  }
  return out;
}

// Значения формы → payload PB (пустые строки в списках убираем; объекты как есть,
// неотредактированные ключи сохранены мержем в Field).
function toPayload(cfg: CollectionCfg, form: Rec): Rec {
  const out: Rec = {};
  for (const f of cfg.fields) {
    if (f.type === "photos") continue; // управляется PhotoUploader напрямую
    const v = form[f.name];
    if (f.type === "stringList")
      out[f.name] = (Array.isArray(v) ? v : [])
        .map((s) => String(s).trim())
        .filter(Boolean);
    else out[f.name] = v;
  }
  return out;
}

export function CollectionEdit() {
  const { name = "", id } = useParams();
  const cfg = collectionByName(name);
  const nav = useNavigate();
  const [form, setForm] = useState<Rec>({});
  const [recordId, setRecordId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cfg) return;
    setLoading(true);
    const load = async () => {
      if (cfg.singleton) {
        const all = await pb.collection(name).getFullList<Rec & { id: string }>();
        const rec = all[0] ?? null;
        setRecordId(rec?.id ?? null);
        setForm(toForm(cfg, rec));
      } else if (id) {
        const rec = await pb.collection(name).getOne<Rec>(id);
        setRecordId(id);
        setForm(toForm(cfg, rec));
      } else {
        setRecordId(null);
        setForm(toForm(cfg, null));
      }
    };
    load().finally(() => setLoading(false));
  }, [name, id, cfg]);

  if (!cfg) return <p>Неизвестная коллекция.</p>;

  const setField = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!cfg) return;
    setError(null);
    let payload: Rec;
    try {
      payload = toPayload(cfg, form);
    } catch {
      setError("Ошибка в JSON-поле — проверьте синтаксис");
      return;
    }
    setBusy(true);
    try {
      if (recordId) await pb.collection(name).update(recordId, payload);
      else await pb.collection(name).create(payload);
      if (!cfg.singleton) nav(`/c/${name}`);
      else setError("✓ Сохранено");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!cfg || !recordId) return;
    if (!confirm("Удалить запись?")) return;
    await pb.collection(name).delete(recordId);
    nav(`/c/${name}`);
  }

  if (loading) return <p>Загрузка…</p>;

  return (
    <div className="edit">
      <div className="list-head">
        <h1>
          {cfg.label}
          {!cfg.singleton && (recordId ? " — правка" : " — новая")}
        </h1>
        {!cfg.singleton && recordId && (
          <button className="ghost danger" onClick={remove}>
            Удалить
          </button>
        )}
      </div>
      <div className="form">
        {cfg.fields.map((f) =>
          f.type === "photos" ? (
            <div className="field" key={f.name}>
              <span className="lbl">{f.label}</span>
              {recordId ? (
                <PhotoUploader
                  collection={name}
                  recordId={recordId}
                  initial={(form[f.name] as string[]) ?? []}
                />
              ) : (
                <p className="note">Сохраните запись — потом появится загрузка фото.</p>
              )}
            </div>
          ) : (
            <Field
              key={f.name}
              spec={f}
              value={form[f.name]}
              onChange={(v) => setField(f.name, v)}
            />
          ),
        )}
      </div>
      {error && <p className={error.startsWith("✓") ? "ok" : "error"}>{error}</p>}
      <div className="actions">
        <button className="btn" disabled={busy} onClick={save}>
          {busy ? "Сохраняем…" : "Сохранить"}
        </button>
        {!cfg.singleton && (
          <button className="ghost" onClick={() => nav(`/c/${name}`)}>
            Отмена
          </button>
        )}
      </div>
    </div>
  );
}

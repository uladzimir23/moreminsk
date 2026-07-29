import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collectionByName } from "../lib/collections";
import { createDraft } from "../lib/draft";
import { pb } from "../lib/pb";
import { CollectionEdit } from "./CollectionEdit";

type Row = Record<string, unknown> & { id: string };

function cell(col: string, v: unknown) {
  if (col === "published")
    return (
      <span className={`pill ${v ? "on" : "off"}`}>{v ? "да" : "нет"}</span>
    );
  if (v === true) return "✓";
  if (v === false) return "—";
  if (Array.isArray(v)) return v.join(", ");
  return String(v ?? "");
}

export function CollectionList() {
  const { name = "" } = useParams();
  const cfg = collectionByName(name);
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function onCreate() {
    if (!cfg) return;
    setCreating(true);
    try {
      const id = await createDraft(cfg);
      nav(`/c/${name}/${id}`);
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!cfg || cfg.singleton) return;
    setLoading(true);
    pb.collection(name)
      .getFullList<Row>({ sort: "order" })
      .then(setRows)
      .finally(() => setLoading(false));
  }, [name, cfg]);

  if (!cfg) return <p>Неизвестная коллекция.</p>;
  // Синглтон — сразу форма единственной записи.
  if (cfg.singleton) return <CollectionEdit />;

  return (
    <div className="list">
      <div className="list-head">
        <h1>{cfg.label}</h1>
        <button className="btn" onClick={onCreate} disabled={creating}>
          {creating ? "…" : "+ Создать"}
        </button>
      </div>
      {loading ? (
        <p>Загрузка…</p>
      ) : (
        <table>
          <thead>
            <tr>
              {cfg.listColumns.map((c) => (
                <th key={c}>{c}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                {cfg.listColumns.map((c) => (
                  <td key={c}>{cell(c, r[c])}</td>
                ))}
                <td className="right">
                  <Link to={`/c/${name}/${r.id}`}>Править</Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={cfg.listColumns.length + 1}>Пусто</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

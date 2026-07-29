import { useEffect, useState } from "react";
import { pb } from "../lib/pb";

type Lead = {
  id: string;
  created: string;
  name?: string;
  phone?: string;
  service?: string;
  yacht?: string;
  date?: string;
  guests?: number;
  comment?: string;
  status?: string;
};

const STATUSES = ["new", "contacted", "closed"];

export function Leads() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pb.collection("leads")
      .getFullList<Lead>({ sort: "-created" })
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  async function setStatus(id: string, status: string) {
    await pb.collection("leads").update(id, { status });
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="list">
      <div className="list-head">
        <h1>Заявки</h1>
      </div>
      {loading ? (
        <p>Загрузка…</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Услуга</th>
              <th>Яхта</th>
              <th>Когда</th>
              <th>Гостей</th>
              <th>Комментарий</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created).toLocaleString("ru")}</td>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.service}</td>
                <td>{r.yacht}</td>
                <td>{r.date}</td>
                <td>{r.guests}</td>
                <td className="comment">{r.comment}</td>
                <td>
                  <select
                    value={r.status ?? "new"}
                    onChange={(e) => setStatus(r.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9}>Заявок пока нет</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

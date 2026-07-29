import type { FieldSpec } from "../lib/collections";

type Props = {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
};

type Obj = Record<string, unknown>;

// Рендер поля по спецификации. Значения в форме:
//   text/textarea/select → string; number → number|null; bool → boolean;
//   stringList → string[]; group → объект; objectList → массив объектов.
// group/objectList мержат правки на исходный объект — неотредактированные ключи
// сохраняются (нет потери данных vs raw JSON).
export function Field({ spec, value, onChange }: Props) {
  // ── Группа (структурный редактор объекта) ──
  if (spec.type === "group") {
    const obj = (value ?? {}) as Obj;
    return (
      <div className="field">
        <span className="lbl">{spec.label}</span>
        <div className="group">
          {(spec.fields ?? []).map((sf) => (
            <Field
              key={sf.name}
              spec={sf}
              value={obj[sf.name]}
              onChange={(v) => onChange({ ...obj, [sf.name]: v })}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Список объектов (репитер) ──
  if (spec.type === "objectList") {
    const arr = (Array.isArray(value) ? value : []) as Obj[];
    return (
      <div className="field">
        <span className="lbl">{spec.label}</span>
        <div className="repeater">
          {arr.map((item, i) => (
            <div className="repeater-item" key={i}>
              <button
                type="button"
                className="repeater-rm"
                title="Удалить"
                onClick={() => onChange(arr.filter((_, j) => j !== i))}
              >
                ✕
              </button>
              {(spec.itemFields ?? []).map((sf) => (
                <Field
                  key={sf.name}
                  spec={sf}
                  value={item[sf.name]}
                  onChange={(v) =>
                    onChange(
                      arr.map((a, j) => (j === i ? { ...a, [sf.name]: v } : a)),
                    )
                  }
                />
              ))}
            </div>
          ))}
          <button
            type="button"
            className="repeater-add"
            onClick={() => onChange([...arr, {}])}
          >
            + {spec.itemLabel ?? "Добавить"}
          </button>
        </div>
      </div>
    );
  }

  const label = (
    <span className="lbl">
      {spec.label}
      {spec.required && <b className="req">*</b>}
    </span>
  );

  if (spec.type === "bool") {
    return (
      <label className="field field-bool">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    );
  }

  return (
    <label className="field">
      {label}
      {spec.type === "textarea" && (
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {spec.type === "stringList" && (
        <textarea
          rows={4}
          value={(Array.isArray(value) ? value : []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
      )}
      {spec.type === "number" && (
        <input
          type="number"
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      )}
      {spec.type === "select" && (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {(spec.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o === "" ? "—" : o}
            </option>
          ))}
        </select>
      )}
      {spec.type === "text" && (
        <input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {spec.help && <small className="help">{spec.help}</small>}
      {spec.type === "stringList" && (
        <small className="help">По одному значению на строку</small>
      )}
    </label>
  );
}

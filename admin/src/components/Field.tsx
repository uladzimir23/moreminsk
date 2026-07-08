import type { FieldSpec } from "../lib/collections";

type Props = {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
};

// Рендер одного поля по спецификации. Типы значений в форме:
//   text/textarea/select → string; number → number|null; bool → boolean;
//   stringList → string[]; json → string (сырой JSON, парсится при сохранении).
export function Field({ spec, value, onChange }: Props) {
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
      {spec.type === "json" && (
        <textarea
          className="mono"
          rows={8}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {spec.type === "stringList" && (
        <textarea
          rows={5}
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

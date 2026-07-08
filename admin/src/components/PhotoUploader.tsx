import { useRef, useState } from "react";
import { pb } from "../lib/pb";

const PB_URL = import.meta.env.VITE_PB_URL || window.location.origin;

// Загрузка фото в PB file-поле `photos` (ADR-013). Первое — обложка. Правки в PB
// идут сразу (отдельно от «Сохранить» формы). export скачает файлы в статику.
export function PhotoUploader({
  collection,
  recordId,
  initial,
}: {
  collection: string;
  recordId: string;
  initial: string[];
}) {
  const [photos, setPhotos] = useState<string[]>(initial ?? []);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const thumb = (f: string) =>
    `${PB_URL}/api/files/${collection}/${recordId}/${f}?thumb=320x320`;

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const fd = new FormData();
    for (const f of Array.from(files)) fd.append("photos+", f);
    try {
      const rec = await pb
        .collection(collection)
        .update<{ photos: string[] }>(recordId, fd);
      setPhotos(rec.photos);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(f: string) {
    setBusy(true);
    try {
      const rec = await pb
        .collection(collection)
        .update<{ photos: string[] }>(recordId, { "photos-": f });
      setPhotos(rec.photos);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="photos">
      <div className="photo-grid">
        {photos.map((f, i) => (
          <div key={f} className="photo">
            <img src={thumb(f)} alt="" loading="lazy" />
            {i === 0 && <span className="cover">обложка</span>}
            <button
              type="button"
              className="rm"
              title="Удалить"
              onClick={() => remove(f)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="photo-add"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "…" : "+ Фото"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <small className="help">
        Первое фото — обложка. JPG/PNG/WebP, до 12. Появятся на сайте после
        публикации.
      </small>
    </div>
  );
}

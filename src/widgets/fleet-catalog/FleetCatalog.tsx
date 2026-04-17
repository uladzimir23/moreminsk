"use client";

import { YachtCard } from "@/entities/yacht/ui/YachtCard";
import { YACHTS } from "@/shared/content/yachts";
import clsx from "clsx";
import { useMemo, useState } from "react";
import styles from "./FleetCatalog.module.scss";

type TypeFilter = "all" | "sail" | "motor" | "sail-motor";
type CapacityFilter = "all" | "upTo6" | "upTo8" | "from8";

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "sail", label: "Парусные" },
  { value: "motor", label: "Моторные" },
];

const CAPACITY_OPTIONS: { value: CapacityFilter; label: string }[] = [
  { value: "all", label: "Любая" },
  { value: "upTo6", label: "до 6" },
  { value: "upTo8", label: "до 8" },
  { value: "from8", label: "8 и больше" },
];

export function FleetCatalog() {
  const [type, setType] = useState<TypeFilter>("all");
  const [capacity, setCapacity] = useState<CapacityFilter>("all");

  const filtered = useMemo(() => {
    return YACHTS.filter((y) => {
      if (type !== "all" && y.type !== type) return false;
      if (capacity === "upTo6" && y.capacity > 6) return false;
      if (capacity === "upTo8" && y.capacity > 8) return false;
      if (capacity === "from8" && y.capacity < 8) return false;
      return true;
    });
  }, [type, capacity]);

  return (
    <section className={styles.root} aria-labelledby="fleet-catalog-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Флот</span>
          <h1 id="fleet-catalog-title" className={styles.title}>
            Весь флот — 4 яхты
          </h1>
          <p className={styles.subtitle}>
            Три парусных и одна моторная яхта под любую компанию от 2 до 10 человек. Фильтры помогут
            подобрать под формат.
          </p>
        </header>

        <div className={styles.filters} role="group" aria-label="Фильтры флота">
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Тип</span>
            <div className={styles.chips}>
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={clsx(styles.chip, type === opt.value && styles.chipActive)}
                  aria-pressed={type === opt.value}
                  onClick={() => setType(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Вместимость</span>
            <div className={styles.chips}>
              {CAPACITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={clsx(styles.chip, capacity === opt.value && styles.chipActive)}
                  aria-pressed={capacity === opt.value}
                  onClick={() => setCapacity(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className={styles.count} aria-live="polite">
          Найдено: {filtered.length} из {YACHTS.length}
        </p>

        {filtered.length === 0 ? (
          <p className={styles.empty}>
            Под эти параметры ничего не подошло. Попробуйте смягчить фильтры.
          </p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((yacht) => (
              <YachtCard key={yacht.slug} yacht={yacht} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

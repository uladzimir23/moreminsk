import styles from "./StepIndicator.module.scss";

type Props = {
  current: number;
  total: number;
};

export function StepIndicator({ current, total }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div
      className={styles.root}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Шаг ${current} из ${total}`}
    >
      <span className={styles.label}>
        Шаг {current}/{total}
      </span>
      <div className={styles.track}>
        <div className={styles.fill} style={{ inlineSize: `${pct}%` }} />
      </div>
    </div>
  );
}

import styles from "./section-wave-clip.module.scss";

// Точная копия wavePath() из water-backdrop.tsx, но в относительных координатах
// (0..1). clipPathUnits="objectBoundingBox" → клип масштабируется под любую
// высоту секции автоматически.
//
// $y: вертикальная позиция waveline (0..1, 0.95 = 5% от низа)
// $amp: амплитуда (0..1, 0.025 = 2.5% от высоты — спокойно как фоновые waves)
// $seg: ширина одного сегмента (0..1, 0.04 = 4% от ширины секции)
// Path overscan (-2*seg ... 1+2*seg) даёт seamless wrap при drift-animation.
function wavePathFrac(y: number, amp: number, seg = 0.04): string {
  const n = Math.ceil((1 + seg * 4) / seg) + 2;
  let d = `M${-seg * 2} ${y} q ${seg / 2} ${-amp} ${seg} 0`;
  for (let i = 0; i < n; i += 1) d += ` t ${seg} 0`;
  d += ` L${1 + seg * 2} 1 L${-seg * 2} 1 Z`;
  return d;
}

type Props = {
  id: string;
};

// Inline <svg> с clipPath, скрытый (width/height = 0). Каждая секция вставляет
// его перед своим контентом и ссылается через `clip-path: url(#<id>)` в CSS.
// Drift через SMIL <animateTransform> — CSS transform на <g> внутри
// objectBoundingBox-clipPath не работает корректно (coords unitless).
export function SectionWaveClip({ id }: Props) {
  return (
    <svg className={styles.svg} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <g>
            <path d={wavePathFrac(0.95, 0.025, 0.04)} />
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-0.04 0"
              dur="22s"
              repeatCount="indefinite"
            />
          </g>
        </clipPath>
      </defs>
    </svg>
  );
}

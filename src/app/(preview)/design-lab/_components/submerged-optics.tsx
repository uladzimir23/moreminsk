import Link from "next/link";
import { COVER_BY_YACHT } from "../_data/photos";
import styles from "./submerged-optics.module.scss";

// Submerged Optics — a «liquid glass» card that refracts the photo behind it
// through an animated SVG turbulence + displacement filter, adapted from the
// MatterForge «Submerged Optics Workbench». Caustic light drifts over it.
// `standalone` shows the back link (own page); omitted on the lab index tile.
export function SubmergedOptics({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={styles.stage}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.bg} src={COVER_BY_YACHT.eva} alt="" aria-hidden="true" />
      <div className={styles.bgTint} aria-hidden="true" />
      <div className={styles.caustics} aria-hidden="true" />

      {/* SVG filter that backdrop-filter: url(#submergedGlass) references.
          Animated baseFrequency makes the refraction ripple like water. */}
      <svg className={styles.filterHost} aria-hidden="true">
        <defs>
          <filter id="submergedGlass" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.013"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="22s"
                values="0.009 0.013; 0.013 0.009; 0.009 0.013"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className={styles.card}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          Submerged Optics · v3.2
        </p>
        <h1 className={styles.title}>
          Бронь сквозь <span className={styles.titleAccent}>воду.</span>
        </h1>
        <p className={styles.sub}>
          Стеклянная панель преломляет фон, как поверхность Минского моря в штиль. Наведите —
          увидите, как свет каустиками гуляет по стеклу.
        </p>

        <div className={styles.row}>
          <a href="#book" className={styles.btnPrimary}>
            Забронировать выход
          </a>
          <a href="#fleet" className={styles.btnGlass}>
            Флот
          </a>
        </div>

        <div className={styles.readout}>
          <span>Refraction · 0.26</span>
          <span>Caustics · ON</span>
          <span>Минское море</span>
        </div>
      </div>

      {standalone && (
        <Link href="/design-lab/" className={styles.back}>
          ← Все варианты
        </Link>
      )}
    </section>
  );
}

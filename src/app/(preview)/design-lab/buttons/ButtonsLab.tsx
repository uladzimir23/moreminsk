"use client";

import clsx from "clsx";
import { ArrowRight, Moon, Phone, Plus, Sailboat, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import styles from "./buttons-lab.module.scss";

type Variant = { cls: string; name: string; desc: string };

// Batch A — edge-light family (rings, comets, glow).
const BATCH_A: ReadonlyArray<Variant> = [
  {
    cls: "bConic",
    name: "Running light",
    desc: "Одна яркая комета бежит по кромке (conic + вращение угла).",
  },
  {
    cls: "bDual",
    name: "Dual comets",
    desc: "Синяя и алая искры гоняются друг за другом по периметру.",
  },
  { cls: "bAurora", name: "Aurora flow", desc: "Цветная кромка плавно переливается. Без полос." },
  { cls: "bGlint", name: "Glint sweep", desc: "Статичный бренд-градиент + белый блик орбитой." },
  { cls: "bPulse", name: "Pulse glow", desc: "Ровная кромка + дышащее свечение вокруг." },
  {
    cls: "bTrace",
    name: "Trace on hover",
    desc: "В покое волосок; на ховере рамка прорисовывается.",
  },
  { cls: "bGlass", name: "Liquid glass", desc: "Блик сверху + тень + гало — Apple-пилюля." },
  { cls: "bRing", name: "Hairline + halo", desc: "Чёткий 1px-волосок + размытое цветное гало." },
  {
    cls: "bIgnite",
    name: "Ignite",
    desc: "В покое статичная градиент-кромка; на ховере Spotlight за курсором + размытое свечение сзади.",
  },
];

// Batch B — другие механики (пунктир, скобки, неон, гравировка, спот, фольга, рамки).
const BATCH_B: ReadonlyArray<Variant> = [
  {
    cls: "bAnts",
    name: "Marching ants",
    desc: "Диагональный пунктир бежит по кромке (барбер-пол).",
  },
  { cls: "bBracket", name: "Corner brackets", desc: "Угловые L-скобки (HUD), растут на ховере." },
  {
    cls: "bNeon",
    name: "Neon outline",
    desc: "Светящийся контур, разгорается на ховере. Под ghost.",
  },
  { cls: "bEmboss", name: "Emboss", desc: "Кромка вдавлена внутрь — гравировка, без кольца." },
  { cls: "bSpot", name: "Spotlight", desc: "Яркое пятно на кромке следует за курсором." },
  { cls: "bHolo", name: "Holographic", desc: "Весь контур — вращающийся спектр (фольга)." },
  { cls: "bFrame", name: "Double frame", desc: "Внешняя рамка с отступом, выезжает на ховере." },
  {
    cls: "bUnderline",
    name: "Underline → frame",
    desc: "Подчёркивание прорастает в полную рамку.",
  },
];

// Batch C — составные: рост / 3D-изгиб / движение иконки и текста.
const BATCH_C: ReadonlyArray<Variant> = [
  {
    cls: "bMagnet",
    name: "Magnet",
    desc: "Кнопка чуть растёт, кромка загорается, текст и иконка разъезжаются.",
  },
  {
    cls: "bTilt",
    name: "Tilt 3D",
    desc: "Поверхность выгибается назад в 3D и приподнимается на ховере.",
  },
  {
    cls: "bChoreo",
    name: "Choreo",
    desc: "Иконка вылетает и возвращается с другой стороны, текст расходится, кромка светится.",
  },
];

// Batch D — комплекты: спокойный rest + составной hover.
const BATCH_D: ReadonlyArray<Variant> = [
  {
    cls: "bSignature",
    name: "Signature",
    desc: "Running light в покое; на ховере рост + 3D-тильт за курсором + лёгкий Spotlight той же палитры + иконка летит (Choreo).",
  },
  {
    cls: "bSignatureSoft",
    name: "Signature · soft",
    desc: "Спокойнее: статичная кромка; на ховере тильт за курсором + рост + размытое свечение сзади + иконка скользит.",
  },
  {
    cls: "bSigSubtle",
    name: "Signature · subtle",
    desc: "Тихий замес: медленная комета, мягкий тильт (×0.55), маленький спот, рост ×1.03, иконка скользит.",
  },
  {
    cls: "bSigPunchy",
    name: "Signature · punchy",
    desc: "Резкий: быстрая комета, сильный тильт (×1.6), крупный спот, рост ×1.07, иконка летит петлёй, мощный glow.",
  },
  {
    cls: "bSigSettle",
    name: "Signature · settle ★",
    desc: "Комета бежит в покое, на ховере ЗАМИРАЕТ — спот и тильт берут верх, иконка летит петлёй (как 21). Финальный.",
  },
  {
    cls: "bSigHolo",
    name: "Signature · holo",
    desc: "В покое голографическое кольцо вместо кометы; ховер: тильт + спот + иконка летит.",
  },
];

// Track the pointer inside the button: --mx/--my (px from top-left) feed the
// Spotlight treatments; --rx/--ry (deg) feed the cursor-driven 3D tilt. Cheap —
// only fires for the hovered button; variants that don't read the vars ignore them.
const TILT_MAX = 8; // deg
function track(e: MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.setProperty("--ry", `${(x / r.width - 0.5) * 2 * TILT_MAX}deg`);
  el.style.setProperty("--rx", `${-(y / r.height - 0.5) * 2 * TILT_MAX}deg`);
}

function Row({ cls, name, desc, num }: Variant & { num: number }) {
  const b = styles[cls];
  return (
    <section className={styles.row}>
      <div className={styles.rowHead}>
        <span className={styles.rowNum}>{String(num).padStart(2, "0")}</span>
        <span className={styles.rowName}>{name}</span>
      </div>
      <p className={styles.rowDesc}>{desc}</p>
      <div className={styles.cluster}>
        <button type="button" onMouseMove={track} className={clsx(styles.btn, styles.solid, b)}>
          <span className={styles.label}>Забронировать</span>
          <ArrowRight aria-hidden />
        </button>
        <button
          type="button"
          onMouseMove={track}
          className={clsx(styles.btn, styles.pill, styles.ghost, b)}
        >
          <Sailboat aria-hidden />
          <span className={styles.label}>Яхты</span>
        </button>
        <button
          type="button"
          onMouseMove={track}
          className={clsx(styles.btn, styles.pill, styles.solid, b)}
        >
          <Phone aria-hidden />
          <span className={styles.label}>Звонок</span>
        </button>
        <button
          type="button"
          onMouseMove={track}
          className={clsx(styles.btn, styles.iconBtn, styles.ghost, b)}
          aria-label="Добавить"
        >
          <Plus aria-hidden />
        </button>
      </div>
    </section>
  );
}

export function ButtonsLab() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // One-time sync of the toggle to the theme the anti-FOUC script set pre-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark-theme"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const from = next ? "light-theme" : "dark-theme";
    const to = next ? "dark-theme" : "light-theme";
    for (const el of [document.documentElement, document.body]) {
      el.classList.remove(from);
      el.classList.add(to);
    }
    document.documentElement.style.colorScheme = next ? "dark" : "light";
  }

  return (
    <main className={styles.lab}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Button borders — lab</h1>
          <p className={styles.lede}>
            Бордеры на нашей геометрии: квадратные CTA (solid / ghost) + круглые пилюля и иконка.
            Наводи — состояния видны на ховере. Скажи номер — перенесу в <code>btn-cta</code>.
          </p>
        </div>
        <button type="button" className={styles.themeBtn} onClick={toggle}>
          {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
          {dark ? "Светлая" : "Тёмная"}
        </button>
      </header>

      <h2 className={styles.groupTitle}>Батч A · свет на кромке</h2>
      <div className={styles.grid}>
        {BATCH_A.map((v, i) => (
          <Row key={v.cls} num={i + 1} {...v} />
        ))}
      </div>

      <h2 className={styles.groupTitle}>Батч B · другие механики</h2>
      <div className={styles.grid}>
        {BATCH_B.map((v, i) => (
          <Row key={v.cls} num={BATCH_A.length + i + 1} {...v} />
        ))}
      </div>

      <h2 className={styles.groupTitle}>Батч C · составные / движение</h2>
      <div className={styles.grid}>
        {BATCH_C.map((v, i) => (
          <Row key={v.cls} num={BATCH_A.length + BATCH_B.length + i + 1} {...v} />
        ))}
      </div>

      <h2 className={styles.groupTitle}>Батч D · комплекты ★</h2>
      <div className={styles.grid}>
        {BATCH_D.map((v, i) => (
          <Row key={v.cls} num={BATCH_A.length + BATCH_B.length + BATCH_C.length + i + 1} {...v} />
        ))}
      </div>
    </main>
  );
}

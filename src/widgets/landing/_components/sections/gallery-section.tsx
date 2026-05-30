import { Link } from "@/i18n/navigation";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { ArrowRight } from "lucide-react";
import { GALLERY } from "../../_data/photos";
import { SectionWaveClip } from "../section-wave-clip";
import styles from "./gallery-section.module.scss";

// «03 · Галерея» — auto-marquee teaser: photos slide in two opposite rows with a
// soft edge-fade (hover pauses + gently zooms). The full browsable grid + lightbox
// lives on /galereya. Pure CSS animation → server component.
const MID = Math.ceil(GALLERY.length / 2);
const ROWS = [GALLERY.slice(0, MID), GALLERY.slice(MID)];
const URLS = GALLERY.map((s) => s.url);

export function GallerySection() {
  return (
    <section className={styles.section} id="gallery">
      <SectionWaveClip id="gallery-wave-clip" />

      {/* Static ambient wash of the set behind the marquee. */}
      <AmbientBackdrop images={URLS} activeIndex={0} className={styles.bg} />

      <SectionHeader
        eyebrow="03 · Галерея"
        title="Атмосфера"
        accent="на воде."
        tone="media"
        framed
      />

      <div className={styles.rail}>
        {ROWS.map((row, r) => (
          <div className={styles.row} key={r}>
            <div className={`${styles.track}${r === 1 ? ` ${styles.trackReverse}` : ""}`}>
              {/* Row rendered twice so translateX(-50%) loops seamlessly. */}
              {[...row, ...row].map((shot, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={`${shot.url}-${i}`}
                  className={styles.shot}
                  src={shot.url}
                  alt={i < row.length ? shot.alt : ""}
                  aria-hidden={i < row.length ? undefined : true}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.more}>
        <Link href="/galereya" className={styles.moreLink}>
          Вся галерея
          <ArrowRight className={styles.moreIcon} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

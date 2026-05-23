import { GALLERY } from "../../_data/photos";
import styles from "./gallery-section.module.scss";

export function GallerySection() {
  return (
    <section className={styles.section} id="gallery">
      <div className={styles.head}>
        <p className={styles.eyebrow}>03 · Галерея</p>
        <h2 className={styles.title}>
          Атмосфера <span className={styles.accent}>на воде.</span>
        </h2>
      </div>

      <div className={styles.mosaic}>
        {GALLERY.map((shot) => (
          <div key={shot.url} className={styles.tile}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.url} alt={shot.alt} loading="lazy" />
            <span className={styles.caption}>{shot.yacht}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

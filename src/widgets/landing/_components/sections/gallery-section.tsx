"use client";

import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import { useMemo, useState } from "react";
import { GALLERY } from "../../_data/photos";
import styles from "./gallery-section.module.scss";

// «03 · Галерея» — the same photo viewer as the fleet, fed the flat GALLERY set
// (per-photo alt + yacht tag on the frame). Reuses <YachtGallery> +
// <AmbientBackdrop> instead of a bespoke viewer.
export function GallerySection() {
  const [bgIdx, setBgIdx] = useState(0);
  const urls = useMemo(() => GALLERY.map((s) => s.url), []);
  const alts = useMemo(() => GALLERY.map((s) => s.alt), []);
  const tags = useMemo(() => GALLERY.map((s) => s.yacht), []);

  return (
    <section className={styles.section} id="gallery">
      {/* Ambient section backdrop — blurred copy of the active photo. */}
      <AmbientBackdrop images={urls} activeIndex={bgIdx} />

      <SectionHeader
        eyebrow="03 · Галерея"
        title="Атмосфера"
        accent="на воде."
        tone="media"
        framed
      />

      <div className={styles.viewer}>
        <YachtGallery
          photos={urls}
          alts={alts}
          tags={tags}
          name="Минское море"
          onActiveChange={setBgIdx}
        />
      </div>
    </section>
  );
}

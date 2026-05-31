"use client";

import { useEffect } from "react";

// Sets `document.body[data-overlay="<name>"]` while `active` is true, removes
// on cleanup. Header (landing-header.module.scss) listens to this attribute
// to disappear when any fullscreen overlay is open: booking popup, stories
// viewer, gallery lightbox. Counter is per-name + per-mount so multiple panels
// can co-exist without one closing wiping the attribute the other still needs.
const ACTIVE = new Set<string>();

export function useOverlaySignal(name: string, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const token = `${name}-${Math.random().toString(36).slice(2, 7)}`;
    ACTIVE.add(token);
    document.body.setAttribute("data-overlay", name);
    return () => {
      ACTIVE.delete(token);
      if (ACTIVE.size === 0) document.body.removeAttribute("data-overlay");
    };
  }, [name, active]);
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { StickyCtaBar } from "./StickyCtaBar";

export type StickyCtaIcon = "arrow" | "gallery" | "check";

export interface StickyCtaConfig {
  label: string;
  /** Secondary line — e.g. the live price in the booking section. */
  note?: string;
  icon?: StickyCtaIcon;
  disabled?: boolean;
  onClick: () => void;
}

interface StickyCtaApi {
  /** Ref-callback: register a section's element for in-view tracking. */
  observe: (id: string, el: HTMLElement | null) => void;
  /** Set / clear a section's CTA descriptor. */
  setConfig: (id: string, config: StickyCtaConfig | null) => void;
}

const StickyCtaCtx = createContext<StickyCtaApi | null>(null);

// Page-level conversion bar. Each anchored section registers (a) its element,
// so the bar knows which section the reader is on, and (b) a CTA descriptor
// (label + action — «Забронировать», a live price, the gallery opener…). The
// bar renders the descriptor of whichever registered section is crossing the
// viewport's centre band and hides on the sections that register nothing.
export function StickyCtaProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, StickyCtaConfig>>({});

  const elToId = useRef<Map<Element, string>>(new Map());
  const idToEl = useRef<Map<string, HTMLElement>>(new Map());
  const ratios = useRef<Map<string, number>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = elToId.current.get(entry.target);
          if (id) ratios.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: string | null = null;
        let bestRatio = 0;
        ratios.current.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        });
        setActiveId(bestRatio > 0 ? best : null);
      },
      // A thin band at the vertical centre — the section under it is «the one
      // the reader is on», so exactly one CTA is active at a time and the bar
      // disappears over sections that register nothing.
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.5, 1] },
    );
    observerRef.current = io;
    idToEl.current.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      observerRef.current = null;
    };
  }, []);

  const observe = useCallback((id: string, el: HTMLElement | null) => {
    const prev = idToEl.current.get(id);
    if (prev && prev !== el) {
      observerRef.current?.unobserve(prev);
      elToId.current.delete(prev);
      idToEl.current.delete(id);
      ratios.current.delete(id);
    }
    if (el) {
      elToId.current.set(el, id);
      idToEl.current.set(id, el);
      observerRef.current?.observe(el);
    }
  }, []);

  const setConfig = useCallback((id: string, config: StickyCtaConfig | null) => {
    setConfigs((prev) => {
      if (!config) {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      }
      const cur = prev[id];
      if (
        cur &&
        cur.label === config.label &&
        cur.note === config.note &&
        cur.icon === config.icon &&
        cur.disabled === config.disabled &&
        cur.onClick === config.onClick
      ) {
        return prev;
      }
      return { ...prev, [id]: config };
    });
  }, []);

  const active = activeId ? configs[activeId] : undefined;

  return (
    <StickyCtaCtx.Provider value={{ observe, setConfig }}>
      {children}
      <StickyCtaBar config={active} />
    </StickyCtaCtx.Provider>
  );
}

function useStickyCtaApi(): StickyCtaApi {
  const ctx = useContext(StickyCtaCtx);
  if (!ctx) throw new Error("useStickyCta must be used within <StickyCtaProvider>");
  return ctx;
}

// Section hook. Feed it the section id and a (possibly changing) CTA
// descriptor; it returns a ref-callback to put on the section element. onClick
// is read through a ref so the descriptor only re-registers when the visible
// bits (label / note / disabled) actually change — a live price updating every
// drag tick stays cheap.
export function useStickyCta(id: string, config: StickyCtaConfig | null) {
  const { observe, setConfig } = useStickyCtaApi();

  const onClickRef = useRef(config?.onClick);
  useEffect(() => {
    onClickRef.current = config?.onClick;
  });

  const hasConfig = config != null;
  const label = config?.label;
  const note = config?.note;
  const icon = config?.icon;
  const disabled = config?.disabled;

  useEffect(() => {
    if (!hasConfig || label == null) {
      setConfig(id, null);
      return;
    }
    setConfig(id, { label, note, icon, disabled, onClick: () => onClickRef.current?.() });
    return () => setConfig(id, null);
  }, [id, hasConfig, label, note, icon, disabled, setConfig]);

  return useCallback((el: HTMLElement | null) => observe(id, el), [observe, id]);
}

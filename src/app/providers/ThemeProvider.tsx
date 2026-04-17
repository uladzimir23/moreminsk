"use client";

import { ThemeContext, type ThemeContextValue } from "@/shared/lib/theme/ThemeContext";
import { THEME_STORAGE_KEY, type Theme, type ThemePreference } from "@/shared/lib/theme/types";
import { useCallback, useMemo, useSyncExternalStore } from "react";

// Anti-FOUC inline script in <head> already painted the correct class for
// first paint. This provider exposes the live preference (read from localStorage
// + matchMedia) and updates DOM classes on user-driven changes.

function isPreference(v: unknown): v is ThemePreference {
  return v === "light" || v === "dark" || v === "system";
}

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isPreference(raw) ? raw : "system";
}

function readSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Subscribe to both `storage` (cross-tab) and a custom `moreminsk:theme`
// event (same-tab — dispatched by setPreference below).
function subscribePreference(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("moreminsk:theme", cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("moreminsk:theme", cb);
  };
}

function subscribeSystemTheme(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function applyThemeClass(theme: Theme) {
  const html = document.documentElement;
  const body = document.body;
  const next = `${theme}-theme`;
  const prev = theme === "dark" ? "light-theme" : "dark-theme";
  html.classList.remove(prev);
  html.classList.add(next);
  body?.classList.remove(prev);
  body?.classList.add(next);
  html.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(
    subscribePreference,
    readPreference,
    () => "system" as ThemePreference,
  );
  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    readSystemTheme,
    () => "light" as Theme,
  );
  const theme: Theme = preference === "system" ? systemTheme : preference;

  // Sync DOM classes on every theme change (hydration mismatch with the
  // anti-FOUC script self-corrects here on the first commit).
  if (typeof window !== "undefined") {
    queueMicrotask(() => applyThemeClass(theme));
  }

  const setPreference = useCallback((next: ThemePreference) => {
    if (next === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
    window.dispatchEvent(new Event("moreminsk:theme"));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, preference, setPreference }),
    [theme, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

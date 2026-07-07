// Theme contract per ADR-006.
// `system` follows OS preference live (matchMedia listener).
// `light` / `dark` are explicit user overrides.
export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export const THEME_STORAGE_KEY = "moreminsk-theme";

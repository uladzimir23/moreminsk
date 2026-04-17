"use client";

import { createContext } from "react";
import type { Theme, ThemePreference } from "./types";

export type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (next: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

"use client";

import { useContext } from "react";
import { PanelContext } from "./PanelContext";
import type { PanelContextValue } from "./types";

export function usePanel(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("usePanel must be used within <PanelProvider>");
  return ctx;
}

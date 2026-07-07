"use client";

import { PanelContext } from "@/shared/lib/panel/PanelContext";
import type { PanelContextValue, PanelMode } from "@/shared/lib/panel/types";
import { useCallback, useMemo, useState } from "react";

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PanelMode | null>(null);
  const [payload, setPayload] = useState<unknown>(undefined);

  const open = useCallback((next: PanelMode, p?: unknown) => {
    setMode(next);
    setPayload(p);
  }, []);

  const close = useCallback(() => {
    setMode(null);
    setPayload(undefined);
  }, []);

  const value = useMemo<PanelContextValue>(
    () => ({ isOpen: mode !== null, mode, payload, open, close }),
    [mode, payload, open, close],
  );

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

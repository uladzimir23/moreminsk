"use client";

import { PanelProvider } from "./PanelProvider";
import { ThemeProvider } from "./ThemeProvider";

// Single client boundary so server components can stay server-rendered
// above and just pass children through. Order: theme outermost (UI must
// know light/dark before any interactive element renders), panel inside.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PanelProvider>{children}</PanelProvider>
    </ThemeProvider>
  );
}

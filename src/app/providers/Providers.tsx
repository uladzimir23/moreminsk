"use client";

import { BookingPanel } from "@/widgets/booking-panel/BookingPanel";
import { PanelProvider } from "./PanelProvider";
import { ThemeProvider } from "./ThemeProvider";

// Single client boundary so server components can stay server-rendered above
// and just pass children through. Order: theme outermost (UI must know light/
// dark before any interactive element renders), panel inside.
//
// <BookingPanel /> lives INSIDE PanelProvider so it can subscribe to usePanel,
// listening for mode === "order" — every `open("order", { yacht? })` site-wide
// opens this global popup (header CTA, FleetCard, FleetList sticky-bar, prices,
// services, contacts — all previously dead before this mount).
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PanelProvider>
        {children}
        <BookingPanel />
      </PanelProvider>
    </ThemeProvider>
  );
}

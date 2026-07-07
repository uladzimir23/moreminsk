"use client";

import { createContext } from "react";
import type { PanelContextValue } from "./types";

export const PanelContext = createContext<PanelContextValue | null>(null);

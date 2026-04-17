// Self-hosted via next/font (no Google CDN at runtime).
// Manrope — UI/body/headings (preload). Lora — accent only via <Accent> (no preload).
// Per ADR-008.
import { Lora, Manrope } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const lora = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

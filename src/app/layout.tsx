// Pass-through root layout. Real <html>/<body> live in `[locale]/layout.tsx`
// so the `lang` attribute reflects the active locale (next-intl convention).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

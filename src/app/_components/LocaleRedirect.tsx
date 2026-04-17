// Static meta-refresh for non-locale URLs (`/fleet/` → `/ru/fleet/`).
// `output: "export"` не умеет в 308, поэтому эмитим HTML-страницу с
// `<meta http-equiv="refresh">`. Хостинг может перехватить это правилом
// rewrite и отдавать настоящий 308 в проде.
export function LocaleRedirect({ to }: { to: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <noscript>
        <a href={to}>Перейти на сайт</a>
      </noscript>
    </>
  );
}

// `<Link>` от next/router и next-intl автоматически подцепляет
// `basePath` из next.config.ts. Но raw `<a href>`, meta-refresh и
// `<img src>` — нет. Используй `withBase()` для таких мест.

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  if (!BASE_PATH) return path;
  if (!path.startsWith("/")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}

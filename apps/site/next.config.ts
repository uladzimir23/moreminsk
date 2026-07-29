import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// __dirname нет в ESM — вычисляем через import.meta.url.
// В моно­репо turbopack.root должен указывать на КОРЕНЬ workspace (там
// node_modules с hoisted-зависимостями). turbopack.root=apps/site ломает
// резолв next.js, если он захойстен в root/node_modules.
const appDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(appDir, "../..");

// `NEXT_PUBLIC_BASE_PATH` подставляется на CI для деплоя на
// `*.github.io/moreminsk/` (subpath). Локально и при деплое на
// собственный домен переменную не задаём — basePath остаётся пустым.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,

  // Монорепо: workspace root — корень репо (moreminsk/). Явно указываем,
  // иначе Next выкидывает warning про "inferred workspace root".
  turbopack: { root: workspaceRoot },
  outputFileTracingRoot: workspaceRoot,
};

export default withNextIntl(nextConfig);

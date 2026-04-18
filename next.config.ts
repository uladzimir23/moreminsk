import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
};

export default withNextIntl(nextConfig);

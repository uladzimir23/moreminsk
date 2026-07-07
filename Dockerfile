# syntax=docker/dockerfile:1.7
# Multi-stage build: Bun install → Next.js static export (Node) → nginx:alpine.
# Монорепо (ADR-014): Next-приложение живёт в web/. Build-контекст = КОРЕНЬ репо
# (deploy.yml → context: .), пути ниже — web/-специфичные. node_modules/.next/out
# режутся .dockerignore, поэтому COPY web/ их не тянет.
# basePath НЕ задаём — production-домен more-minsk.by без subpath.

# ─── Stage 1: deps (bun — bun.lock fidelity) ────────────────────────────────
# --ignore-scripts: postinstall'ы (sharp/unrs) в образе раздачи статики не нужны.
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build (Node — Next.js native napi modules не работают на Bun) ──
FROM node:22-alpine AS builder
WORKDIR /app/web
COPY web/ /app/web/
COPY --from=deps /app/web/node_modules /app/web/node_modules
ENV NEXT_TELEMETRY_DISABLED=1
# Canonical origin запекается на билде (sitemap/robots/OG/canonical).
ENV NEXT_PUBLIC_SITE_URL=https://more-minsk.by
# cwd = /app/web → next.config.ts: output:"export" → /app/web/out.
RUN npx next build

# ─── Stage 3: serve (nginx:alpine раздаёт static export) ─────────────────────
FROM nginx:alpine AS runner
# Host-nginx на 89.169.54.11 терминирует HTTPS и проксирует
# more-minsk.by → 127.0.0.1:3004 → этот контейнер. См. infra/nginx/more-minsk.by.conf.
COPY infra/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/web/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

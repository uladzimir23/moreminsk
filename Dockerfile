# syntax=docker/dockerfile:1.7
# Multi-stage build: Bun → Next.js static export → nginx:alpine. Используется
# CI на push в main: `docker build` → push в GHCR → ssh deploy на сервере.
# basePath НЕ задаём — production-домен new.moreminsk.by без subpath.

# ─── Stage 1: build ─────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

# Кэш зависимостей отдельно от source — пересборка при правке кода не
# инвалидирует bun install layer.
# --ignore-scripts: prepare (lefthook install) требует git и .git/ — в build-
# контексте их нет и не нужно, hooks только для dev-машин.
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

# Production build → ./out (next.config.ts: output: "export").
RUN bun run build

# ─── Stage 2: serve ─────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Container-side nginx config: serves Next.js static export. Host-level nginx
# (на сервере) проксирует new.moreminsk.by → 127.0.0.1:3004 → этот контейнер.
COPY infra/nginx/container.conf /etc/nginx/conf.d/default.conf

# Built static assets.
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

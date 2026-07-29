# syntax=docker/dockerfile:1.7
# Multi-stage build: Bun install → Next.js static export (Node) → nginx:alpine.
# Монорепо: приложение живёт в apps/site/. Build-контекст = КОРЕНЬ репо
# (deploy.yml → context: .), пути ниже — apps/site-специфичные.
# basePath НЕ задаём — production-домен more-minsk.by без subpath.
#
# ⚠️ Этот файл — переходной. В следующем коммите переезжает в apps/site/Dockerfile
# с workspace-aware install (root bun.lock, hoisted node_modules).

# ─── Stage 1: deps (bun — bun.lock fidelity) ────────────────────────────────
# --ignore-scripts: postinstall'ы (sharp/unrs) в образе раздачи статики не нужны.
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app/site
COPY apps/site/package.json apps/site/bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build (Node — Next.js native napi modules не работают на Bun) ──
FROM node:22-alpine AS builder
WORKDIR /app/site
COPY apps/site/ /app/site/
COPY --from=deps /app/site/node_modules /app/site/node_modules
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=https://more-minsk.by
# cwd = /app/site → next.config.ts: output:"export" → /app/site/out.
RUN npx next build

# ─── Stage 3: serve (nginx:alpine раздаёт static export) ─────────────────────
FROM nginx:alpine AS runner
# Host-nginx на 89.169.54.11 терминирует HTTPS и проксирует
# more-minsk.by → 127.0.0.1:3004 → этот контейнер. См. infra/nginx/more-minsk.by.conf.
COPY infra/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/site/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

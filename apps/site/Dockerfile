# syntax=docker/dockerfile:1.7
# Multi-stage build: Bun install (workspace-aware) → Next.js static export (Node)
# → nginx:alpine. Монорепо: build-контекст = КОРЕНЬ репо, Dockerfile = apps/site/.
# Deps'ы hoist'ятся в /app/node_modules по bunfig.toml (linker="hoisted").
# basePath НЕ задаём — production-домен more-minsk.by без subpath.

# ─── Stage 1: deps (bun — workspace root, hoisted) ──────────────────────────
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
# workspace root package.json + lockfile + bunfig задают весь граф зависимостей
COPY package.json bun.lock bunfig.toml ./
# workspace-манифесты apps/*/packages/* нужны resolve'у до install
COPY apps/site/package.json ./apps/site/
COPY apps/admin/package.json ./apps/admin/
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/pb-client/package.json ./packages/pb-client/
# --ignore-scripts: postinstall'ы (sharp/unrs) в образе раздачи статики не нужны.
RUN bun install --frozen-lockfile --ignore-scripts

# ─── Stage 2: build (Node — Next.js napi + bun для prebuild TS-скриптов) ────
FROM node:22-alpine AS builder
WORKDIR /app
# bun нужен для scripts/pb/{export,codegen,prebuild}.ts (см. package.json prebuild)
COPY --from=oven/bun:1.3-alpine /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=https://more-minsk.by
# PB_URL: если передан build-arg, prebuild тянет свежий снапшот и генерит
# content/*.ts. Иначе — используются закоммиченные content/*.ts.
ARG PB_URL=""
ENV PB_URL=$PB_URL
WORKDIR /app/apps/site
# `bun run build` триггерит "prebuild" hook (см. package.json).
# next.config.ts: output:"export" → /app/apps/site/out.
RUN bun run build

# ─── Stage 3: serve (nginx:alpine раздаёт static export) ─────────────────────
FROM nginx:alpine AS runner
# Host-nginx на 89.169.54.11 терминирует HTTPS и проксирует
# more-minsk.by → 127.0.0.1:3004 → этот контейнер. См. infra/nginx/more-minsk.by.conf.
COPY infra/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/site/out /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

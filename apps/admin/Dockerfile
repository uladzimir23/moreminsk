# syntax=docker/dockerfile:1.7
# Admin SPA (Vite + React, ADR-013) → nginx:alpine. Монорепо: build-контекст =
# КОРЕНЬ репо, Dockerfile = apps/admin/. Hoisted install через workspace root.
# Раздаётся за host-nginx admin.more-minsk.by/ ; PB на том же origin (/api, /_/).

# ─── Stage 1: deps (bun — workspace root, hoisted) ──────────────────────────
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
COPY apps/site/package.json ./apps/site/
COPY apps/admin/package.json ./apps/admin/
RUN bun install --frozen-lockfile

# ─── Stage 2: build (Node — tsc + vite) ─────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/admin
# npx резолвит бинарники через node_modules корня workspace (linker=hoisted).
RUN npx tsc --noEmit && npx vite build

# ─── Stage 3: serve ─────────────────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

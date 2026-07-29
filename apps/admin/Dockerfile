# syntax=docker/dockerfile:1.7
# Admin SPA (Vite + React, ADR-013) → nginx:alpine. Build-контекст = admin/.
# Раздаётся за host-nginx admin.more-minsk.by/ ; PB на том же origin (/api, /_/).

# ─── Stage 1: deps (bun) ────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ─── Stage 2: build (Node — tsc + vite) ─────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node_modules/.bin/tsc --noEmit && node_modules/.bin/vite build

# ─── Stage 3: serve ─────────────────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

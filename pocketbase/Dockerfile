# syntax=docker/dockerfile:1.7
# PocketBase для more-minsk.by (ADR-012). Бинарь качаем из релиза (linux/amd64),
# pb_migrations бейкаем в образ — схема применяется на старте. pb_data — в
# persistent volume (infra/server/docker-compose.yml). Наружу — host-nginx
# admin.more-minsk.by (/api/, /_/) → 127.0.0.1:80xx → этот контейнер :8090.
#
# Build-контекст = pocketbase/ (не корень репо).
FROM alpine:3.20
RUN apk add --no-cache ca-certificates wget unzip
ARG PB_VERSION=0.25.9
RUN wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" -O /tmp/pb.zip \
  && unzip /tmp/pb.zip -d /pb \
  && rm /tmp/pb.zip
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks
EXPOSE 8090
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8090/api/health >/dev/null 2>&1 || exit 1
CMD ["/pb/pocketbase", "serve", \
     "--http=0.0.0.0:8090", \
     "--dir=/pb/pb_data", \
     "--migrationsDir=/pb/pb_migrations", \
     "--hooksDir=/pb/pb_hooks"]

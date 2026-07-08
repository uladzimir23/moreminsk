#!/usr/bin/env bash
# Скачивает бинарь PocketBase под текущую ОС/арх в pocketbase/pocketbase
# (в .gitignore — в репо не коммитим, ADR-012). Для локальной разработки/
# генерации миграций. Прод-образ качает linux/amd64 сам (pocketbase/Dockerfile).
set -euo pipefail

PB_VERSION="${PB_VERSION:-0.25.9}"
cd "$(dirname "$0")/.."   # → pocketbase/

os="$(uname -s)"; arch="$(uname -m)"
case "$os" in
  Darwin) pbos="darwin" ;;
  Linux)  pbos="linux" ;;
  *) echo "Неизвестная ОС: $os" >&2; exit 1 ;;
esac
case "$arch" in
  arm64|aarch64) pbarch="arm64" ;;
  x86_64|amd64)  pbarch="amd64" ;;
  *) echo "Неизвестная арх: $arch" >&2; exit 1 ;;
esac

url="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${pbos}_${pbarch}.zip"
echo "→ $url"
curl -fsSL "$url" -o pb.zip
unzip -o pb.zip pocketbase >/dev/null
rm -f pb.zip CHANGELOG.md LICENSE.md 2>/dev/null || true
chmod +x pocketbase
echo "✓ pocketbase ${PB_VERSION} (${pbos}/${pbarch}) готов: ./pocketbase serve"

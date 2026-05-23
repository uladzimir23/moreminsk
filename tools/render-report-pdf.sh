#!/usr/bin/env bash
# render-report-pdf.sh — конвертирует Markdown отчёт в PDF в стиле showcase-alchemy.
#
# Стек: pandoc → standalone HTML с встроенным CSS → Chrome headless print-to-pdf.
# Стили: docs/80 - Templates/report-pdf.css (light theme, cyan accent, Inter/Rajdhani/JetBrains Mono).
# Boilerplate: docs/80 - Templates/report.md
#
# Зависимости (всё уже установлено в этом репо):
#   - pandoc 3.x (brew install pandoc)
#   - Google Chrome (/Applications/Google Chrome.app)
#
# Использование:
#   tools/render-report-pdf.sh <path-to-md>
#   tools/render-report-pdf.sh "docs/97 - Reports/2026-05-01 project-map-for-maksim.md"
#
# Output: рядом с MD создаётся .html (промежуточный) и .pdf (финальный).
# .html полезен для preview в браузере; .pdf — для отправки.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-md>" >&2
  exit 1
fi

INPUT="$1"

if [[ ! -f "$INPUT" ]]; then
  echo "✗ File not found: $INPUT" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS="$REPO_ROOT/docs/80-templates/report-pdf.css"

if [[ ! -f "$CSS" ]]; then
  echo "✗ CSS template not found: $CSS" >&2
  exit 1
fi

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$CHROME" ]]; then
  echo "✗ Google Chrome not found at $CHROME" >&2
  exit 1
fi

if ! command -v pandoc >/dev/null 2>&1; then
  echo "✗ pandoc not installed (brew install pandoc)" >&2
  exit 1
fi

BASE="${INPUT%.md}"
HTML="$BASE.html"
PDF="$BASE.pdf"

# Auto-stamp footer: дата рендера + git sha + git branch.
# Не коммитится в .md, генерится в момент сборки.
STAMP_DATE="$(date +%Y-%m-%d)"
STAMP_SHA="$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo 'no-git')"
STAMP_BRANCH="$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'no-git')"

FOOTER_HTML="$(mktemp -t sync-report-footer.XXXX.html)"
trap 'rm -f "$FOOTER_HTML"' EXIT

cat > "$FOOTER_HTML" <<EOF
<footer class="meta-footer">
  Сгенерировано <code>${STAMP_DATE}</code> &middot; commit <code>${STAMP_SHA}</code> &middot; ветка <code>${STAMP_BRANCH}</code>
</footer>
EOF

# Step 1: Markdown → standalone HTML с встроенным CSS.
# YAML frontmatter (title/subtitle/date/author/tags) подхватывается
# через markdown+yaml_metadata_block по умолчанию.
# +wikilinks_title_before_pipe рендерит [[X]] как <a href="X">X</a>
# (видимая стилизованная ссылка, без рабочего hyperlink в PDF).
INPUT_DIR="$(cd "$(dirname "$INPUT")" && pwd)"

pandoc "$INPUT" \
  -f markdown+wikilinks_title_before_pipe \
  -o "$HTML" \
  --standalone \
  --embed-resources \
  --resource-path="$INPUT_DIR" \
  --css="$CSS" \
  --toc --toc-depth=2 \
  --include-after-body="$FOOTER_HTML"

if [[ ! -f "$HTML" ]]; then
  echo "✗ pandoc failed to produce HTML" >&2
  exit 1
fi

# Step 2: HTML → PDF через Chrome headless.
# Chrome требует абсолютные пути — иначе file:// URL некорректно резолвится
# и весь документ рендерится в одну страницу.
HTML_ABS="$(cd "$(dirname "$HTML")" && pwd)/$(basename "$HTML")"
PDF_ABS="$(cd "$(dirname "$PDF")" && pwd)/$(basename "$PDF")"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf="$PDF_ABS" \
  "file://$HTML_ABS" 2>&1 | tail -3

if [[ -f "$PDF" ]]; then
  SIZE=$(stat -f "%z" "$PDF")
  PAGES=$(file "$PDF" | grep -oE '[0-9]+ pages' || echo "?")
  echo ""
  echo "✓ HTML: $HTML"
  echo "✓ PDF:  $PDF (${SIZE} bytes, $PAGES)"
else
  echo "✗ PDF generation failed" >&2
  exit 1
fi

# Step 3: Markdown → DOCX (Word) для редактируемой версии.
# Pandoc нативно поддерживает .docx — изображения встраиваются автоматически
# при resolved-paths (потому передаём --resource-path = dir of input MD).
DOCX="$BASE.docx"
pandoc "$INPUT" \
  -f markdown+wikilinks_title_before_pipe \
  -o "$DOCX" \
  --standalone \
  --resource-path="$INPUT_DIR" \
  --toc --toc-depth=2

if [[ -f "$DOCX" ]]; then
  DSIZE=$(stat -f "%z" "$DOCX")
  echo "✓ DOCX: $DOCX (${DSIZE} bytes)"
else
  echo "⚠ DOCX generation failed (PDF already produced)" >&2
fi

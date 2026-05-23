#!/usr/bin/env python3
"""
capture-screenshots.py — снимает скриншоты страниц moreminsk через Playwright.

Использование:
  # сначала поднять dev-сервер: bun dev (порт 3000)
  python3 tools/capture-screenshots.py [--base http://localhost:3000] [--out docs/reports/YYYY-MM-DD/_assets]

Снимает каждую страницу в двух режимах:
  - mobile  (390 x 844, deviceScaleFactor=2)  — iPhone-подобный viewport
  - desktop (1440 x 900, deviceScaleFactor=1) — стандартный лэптоп

Снимки кладёт как <out>/<slug>-<mobile|desktop>.png.

При повторном запуске старые файлы перезаписываются. Скрипт идемпотентен.
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: playwright not installed (pip install playwright && playwright install)", file=sys.stderr)
    sys.exit(2)


# Канонические URL соответствуют `localePrefix: "always"` в src/i18n/routing.ts —
# поэтому ходим по /ru/..., а не /... (последние редиректят и ломают networkidle).
PAGES: list[dict] = [
    {"slug": "home", "path": "/ru/", "label": "Главная"},
    {"slug": "fleet", "path": "/ru/fleet/", "label": "Флот"},
    {"slug": "services", "path": "/ru/services/", "label": "Услуги — индекс"},
    {"slug": "svidanie", "path": "/ru/services/svidanie/", "label": "Свидание"},
    {"slug": "den-rozhdeniya", "path": "/ru/services/den-rozhdeniya/", "label": "День рождения"},
    {"slug": "korporativ", "path": "/ru/services/korporativ/", "label": "Корпоратив"},
    {"slug": "devichnik", "path": "/ru/services/devichnik/", "label": "Девичник"},
    {"slug": "fotosessiya", "path": "/ru/services/fotosessiya/", "label": "Фотосессия"},
]

VIEWPORTS = {
    "mobile": {"width": 390, "height": 844, "scale": 2},
    "desktop": {"width": 1440, "height": 900, "scale": 1},
}


async def capture(base: str, out: Path) -> int:
    out.mkdir(parents=True, exist_ok=True)
    captured = 0
    errors: list[str] = []

    async with async_playwright() as p:
        for mode, vp in VIEWPORTS.items():
            browser = await p.chromium.launch(headless=True)
            ctx = await browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                device_scale_factor=vp["scale"],
                locale="ru-RU",
            )
            page = await ctx.new_page()

            for entry in PAGES:
                url = f"{base.rstrip('/')}{entry['path']}"
                target = out / f"{entry['slug']}-{mode}.png"
                try:
                    await page.goto(url, wait_until="networkidle", timeout=20000)
                    # дать time на анимации/шрифты
                    await page.wait_for_timeout(800)
                    # full_page=True снимает всю страницу, не только viewport
                    await page.screenshot(path=str(target), full_page=True)
                    captured += 1
                    print(f"  ✓ {mode:<7} {entry['slug']:<20} → {target.name}")
                except Exception as e:
                    errors.append(f"{mode}/{entry['slug']}: {e}")
                    print(f"  ✗ {mode:<7} {entry['slug']:<20} → {e}")

            await ctx.close()
            await browser.close()

    print(f"\n→ Captured: {captured} / {len(PAGES) * len(VIEWPORTS)}")
    if errors:
        print(f"→ Errors:   {len(errors)}")
        return 1
    return 0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:3000", help="Базовый URL dev-сервера")
    ap.add_argument(
        "--out",
        default="docs/reports/_assets",
        help="Папка вывода скриншотов (создаётся при необходимости)",
    )
    args = ap.parse_args()

    out_path = Path(args.out).resolve()
    print(f"→ Base:  {args.base}")
    print(f"→ Out:   {out_path}")
    print(f"→ Pages: {len(PAGES)} × {len(VIEWPORTS)} viewports = {len(PAGES) * len(VIEWPORTS)} screenshots\n")

    rc = asyncio.run(capture(args.base, out_path))
    sys.exit(rc)


if __name__ == "__main__":
    main()

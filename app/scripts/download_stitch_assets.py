from __future__ import annotations

import json
import mimetypes
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
URLS_FILE = ROOT / "stitch_asset_urls.txt"
OUT_DIR = ROOT / "public" / "assets" / "stitch" / "images"
MAP_FILE = ROOT / "stitch_asset_map.json"


def infer_extension(content_type: str | None, url: str) -> str:
    if content_type:
        content_type = content_type.split(";")[0].strip().lower()
        guessed = mimetypes.guess_extension(content_type)
        if guessed:
            if guessed == ".jpe":
                return ".jpg"
            return guessed
    path = urlparse(url).path.lower()
    for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        if path.endswith(ext):
            return ".jpg" if ext == ".jpeg" else ext
    return ".jpg"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    urls = [line.strip() for line in URLS_FILE.read_text(encoding="utf-8").splitlines() if line.strip()]
    mapping: dict[str, str] = {}

    index = 1
    for url in urls:
        req = Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            },
        )
        try:
            with urlopen(req, timeout=90) as resp:
                data = resp.read()
                ext = infer_extension(resp.headers.get("Content-Type"), url)
        except Exception:
            continue

        filename = f"stitch-{index:03d}{ext}"
        out_file = OUT_DIR / filename
        out_file.write_bytes(data)
        mapping[url] = f"/assets/stitch/images/{filename}"
        index += 1

    MAP_FILE.write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    print(f"DOWNLOADED={len(mapping)}")


if __name__ == "__main__":
    main()

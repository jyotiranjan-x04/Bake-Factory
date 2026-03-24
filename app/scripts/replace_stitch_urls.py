from __future__ import annotations
import json
from pathlib import Path

root = Path('.')
map_path = root / 'stitch_asset_map.json'
mapping = json.loads(map_path.read_text(encoding='utf-8'))

updated = []
for file in (root / 'src').rglob('*'):
    if file.suffix.lower() not in {'.tsx', '.ts', '.jsx', '.js', '.css'}:
        continue
    text = file.read_text(encoding='utf-8')
    original = text
    for old, new in mapping.items():
        text = text.replace(old, new)
    if text != original:
        file.write_text(text, encoding='utf-8')
        updated.append(str(file))

print(f'UPDATED_FILES={len(updated)}')
for p in updated:
    print(p)

from __future__ import annotations
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen
import mimetypes

root = Path('.')
pattern = re.compile(r"https://lh3\.googleusercontent\.com/aida-public/[^\"'\s)]+")
urls = set()
for f in (root/'src').rglob('*'):
    if f.suffix.lower() not in {'.tsx','.ts','.js','.jsx','.css'}:
        continue
    txt = f.read_text(encoding='utf-8')
    urls.update(pattern.findall(txt))

map_file = root/'stitch_asset_map.json'
mapping = json.loads(map_file.read_text(encoding='utf-8')) if map_file.exists() else {}

out_dir = root/'public'/'assets'/'stitch'/'images'
out_dir.mkdir(parents=True, exist_ok=True)
next_idx = 1
nums = []
for p in out_dir.glob('stitch-*.*'):
    m = re.search(r'stitch-(\d+)', p.name)
    if m:
        nums.append(int(m.group(1)))
if nums:
    next_idx = max(nums)+1

def ext_for(ctype):
    if ctype:
        ctype = ctype.split(';')[0].strip().lower()
        ext = mimetypes.guess_extension(ctype)
        if ext:
            return '.jpg' if ext == '.jpe' else ext
    return '.jpg'

added = 0
for url in sorted(urls):
    if url in mapping:
        continue
    try:
        req = Request(url, headers={'User-Agent':'Mozilla/5.0'})
        with urlopen(req, timeout=90) as r:
            data = r.read()
            ext = ext_for(r.headers.get('Content-Type'))
    except Exception:
        continue
    name = f'stitch-{next_idx:03d}{ext}'
    (out_dir/name).write_bytes(data)
    mapping[url] = f'/assets/stitch/images/{name}'
    next_idx += 1
    added += 1

updated = 0
for f in (root/'src').rglob('*'):
    if f.suffix.lower() not in {'.tsx','.ts','.js','.jsx','.css'}:
        continue
    txt = f.read_text(encoding='utf-8')
    old = txt
    for k,v in mapping.items():
        txt = txt.replace(k,v)
    if txt != old:
        f.write_text(txt, encoding='utf-8')
        updated += 1

map_file.write_text(json.dumps(mapping, indent=2), encoding='utf-8')
print(f'ADDED={added} MAP_SIZE={len(mapping)} UPDATED_FILES={updated}')

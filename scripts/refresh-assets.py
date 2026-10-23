"""Refresh local CSS, JavaScript, and favicon cache versions after editing assets."""
import hashlib
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / 'dist'
page = root / 'index.html'
html = page.read_text()
for name in ('style.css', 'script.js', 'gallery-data.js', 'course-config.js', 'favicon.svg'):
    version = hashlib.sha256((root / name).read_bytes()).hexdigest()[:12]
    html = re.sub(
        r'((?:href|src)=")' + re.escape(name) + r'(?:\?v=[a-f0-9]+)?"',
        lambda match: match[1] + name + '?v=' + version + '"',
        html,
    )
page.write_text(html)
print('Updated asset cache versions.')

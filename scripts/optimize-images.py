"""Create responsive image copies; never modify the client originals.

Optional maintenance tool: Python 3 + Pillow with AVIF/WebP support.
The deployed website has no Python or build dependency.
"""
import hashlib
import io
import json
from pathlib import Path
import re

from PIL import Image, ImageOps, features

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
OUTPUT = DIST / 'assets' / 'optimized'
MANIFEST = ROOT / 'scripts' / 'image-variants.json'
SOURCES = (
    'helejene-homes-before.jpg', 'helejene-homes-after.png',
    'jeleosinmi-before.png', 'jeleosinmi-after.png',
    'precious-tega-before.png', 'precious-tega-after.png',
    'precious-tega-portrait.png',
)


def picture(stem, img_attributes, sizes, manifest):
    """Keep the existing alt, dimensions, loading mode and CSS classes."""
    variants = manifest[stem]['variants']

    def srcset(extension):
        return ', '.join(f'{entry[extension]} {entry["width"]}w' for entry in variants)

    attrs = re.sub(r'\s(?:src|srcset|sizes)="[^"]*"', '', img_attributes)
    fallback = variants[1]['jpg']
    return (f'<picture data-optimized-image="{stem}">'
            f'<source type="image/avif" srcset="{srcset("avif")}" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{srcset("webp")}" sizes="{sizes}">'
            f'<img src="{fallback}" srcset="{srcset("jpg")}" sizes="{sizes}"{attrs}>'
            '</picture>')


def main():
    if not features.check('webp') or not features.check('avif'):
        raise SystemExit('Pillow with both WebP and AVIF encoders is required.')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for filename in SOURCES:
        source = DIST / 'assets' / filename
        image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
        width, height = image.size
        entries = []
        for target in sorted({360, 720, width}):
            resized = image.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            entry = {'width': target, 'height': resized.height}
            for extension, fmt, options in (
                ('avif', 'AVIF', {'quality': 68, 'speed': 6, 'subsampling': '4:4:4'}),
                ('webp', 'WEBP', {'quality': 86, 'method': 6}),
                ('jpg', 'JPEG', {'quality': 86, 'optimize': True, 'progressive': True, 'subsampling': 0}),
            ):
                buffer = io.BytesIO()
                resized.save(buffer, format=fmt, **options)
                data = buffer.getvalue()
                digest = hashlib.sha256(data).hexdigest()[:12]
                output = OUTPUT / f'{source.stem}-{target}.{digest}.{extension}'
                output.write_bytes(data)
                entry[extension] = output.relative_to(DIST).as_posix()
                entry[extension + 'Bytes'] = len(data)
            entries.append(entry)
        manifest[source.stem] = {
            'original': source.relative_to(DIST).as_posix(),
            'originalBytes': source.stat().st_size,
            'originalSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'width': width, 'height': height, 'variants': entries,
        }
        print(f'{filename}: {source.stat().st_size:,} bytes → {entries[1]["avifBytes"]:,} bytes (720px AVIF)')
    MANIFEST.write_text(json.dumps(manifest, indent=2) + '\n')
    page = DIST / 'index.html'

    def refresh(match):
        stem, contents = match.groups()
        image = re.search(r'<img([^>]*)>', contents)
        sizes = re.search(r' sizes="([^"]+)"', image[1])
        return picture(stem, image[1], sizes[1], manifest)

    html = re.sub(r'<picture data-optimized-image="([^"]+)">(.*?)</picture>', refresh, page.read_text(), flags=re.S)
    page.write_text(html)


if __name__ == '__main__':
    main()

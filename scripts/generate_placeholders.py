"""Generates the placeholder images shipped in public/images.

Run with: python3 scripts/generate_placeholders.py
Replace the output files with real photography to build a real site.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

WIDTH, HEIGHT = 2400, 1600
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "images"

PALETTES = [
    ((28, 24, 18), (196, 152, 96), (92, 78, 52)),
    ((16, 26, 22), (128, 160, 118), (48, 72, 58)),
    ((32, 18, 20), (198, 122, 92), (86, 48, 44)),
]


def gradient(palette, seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:HEIGHT, 0:WIDTH]
    u = x / WIDTH
    v = y / HEIGHT

    hills = 0.55 + 0.12 * np.sin(u * 6.0 + seed) + 0.06 * np.sin(u * 13.0 + seed * 2)
    sky = np.clip((v / hills), 0, 1)[..., None]
    ground = (v > hills)[..., None]

    top = np.array(palette[0], dtype=float)
    mid = np.array(palette[1], dtype=float)
    base = np.array(palette[2], dtype=float)

    image = top * (1 - sky) + mid * sky
    depth = np.clip((v - hills) / (1 - hills + 1e-6), 0, 1)[..., None]
    image = np.where(ground, base * (1 - depth * 0.7) + top * depth * 0.7, image)

    grain = rng.normal(0, 6, (HEIGHT, WIDTH, 1))
    image = np.clip(image + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(image).filter(ImageFilter.GaussianBlur(1.2))


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for index, palette in enumerate(PALETTES, start=1):
        path = OUTPUT / f"{index:02d}.jpg"
        gradient(palette, index * 3).save(path, quality=82, optimize=True)
        print(f"wrote {path}")


if __name__ == "__main__":
    main()

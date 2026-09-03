# Scoop Sense — product-image normalizer.
#
# Every lead image in images/products/ is a 960x720 JPEG on white, so the tiles
# read as one set instead of a scrapbook of retailer photography at eight
# aspect ratios. Brand CDNs serve PNGs with alpha, WebP, squares, and tall
# bottle shots; this converts whatever integrate-images.js downloaded into the
# house format and repoints data/products.js at the .jpg it wrote.
#
#   python scripts/normalize-product-images.py <id> [<id> ...]
#   python scripts/normalize-product-images.py --all-non-jpg
#
# Rules baked in (do not remove):
#   - Transparency is composited onto WHITE, never cropped away. A cutout that
#     loses its own white lid to a colour key is worse than an untouched photo.
#   - The image is CONTAINED, never cropped to fill: a tub that loses its lid
#     to a crop is a different tub as far as a reader scanning the grid.
#   - Files already 960x720 JPEG are left alone, so this is safe to re-run.

import io
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "images", "products")
DATA = os.path.join(ROOT, "data", "products.js")
SIZE = (960, 720)
MARGIN = 0.94  # leave a hair of air so nothing touches the card edge


def normalize(path_in, path_out):
    im = Image.open(path_in)
    if getattr(im, "n_frames", 1) > 1:
        im.seek(0)
    im = im.convert("RGBA")

    canvas = Image.new("RGB", SIZE, (255, 255, 255))
    box = (int(SIZE[0] * MARGIN), int(SIZE[1] * MARGIN))
    fitted = im.copy()
    fitted.thumbnail(box, Image.LANCZOS)

    white = Image.new("RGBA", fitted.size, (255, 255, 255, 255))
    flat = Image.alpha_composite(white, fitted).convert("RGB")
    canvas.paste(flat, ((SIZE[0] - fitted.size[0]) // 2, (SIZE[1] - fitted.size[1]) // 2))

    buf = io.BytesIO()
    canvas.save(buf, "JPEG", quality=88, optimize=True, progressive=True)
    with open(path_out, "wb") as fh:
        fh.write(buf.getvalue())
    return im.size, canvas.size, len(buf.getvalue())


def repoint(product_id, old_rel, new_rel):
    """Point this product's imageUrl at the file we actually wrote."""
    with io.open(DATA, encoding="utf-8") as fh:
        src = fh.read()
    if old_rel == new_rel or old_rel not in src:
        return False
    with io.open(DATA, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(src.replace(old_rel, new_rel))
    return True


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__.strip().split("\n\n")[2])
        return 1

    if args == ["--all-non-jpg"]:
        ids = sorted(
            os.path.splitext(f)[0]
            for f in os.listdir(IMG_DIR)
            if not f.lower().endswith(".jpg")
        )
    else:
        ids = args

    if not ids:
        print("nothing to normalize")
        return 0

    for pid in ids:
        matches = [f for f in os.listdir(IMG_DIR) if os.path.splitext(f)[0] == pid]
        if not matches:
            print("%-40s no file in images/products/" % pid)
            continue
        src_name = sorted(matches, key=lambda f: f.lower().endswith(".jpg"))[0]
        src_path = os.path.join(IMG_DIR, src_name)
        out_path = os.path.join(IMG_DIR, pid + ".jpg")

        try:
            before, after, nbytes = normalize(src_path, out_path)
        except Exception as exc:  # a bad download should not stop the batch
            print("%-40s FAILED — %s" % (pid, exc))
            continue

        if src_name != pid + ".jpg":
            os.remove(src_path)
            repoint(pid, "images/products/" + src_name, "images/products/" + pid + ".jpg")

        print("%-40s %sx%s -> %sx%s, %d KB" % (pid, before[0], before[1], after[0], after[1], nbytes // 1024))
    return 0


if __name__ == "__main__":
    sys.exit(main())

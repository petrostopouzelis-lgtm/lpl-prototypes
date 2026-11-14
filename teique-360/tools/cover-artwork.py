# Makes assets/cover-2026.jpg (the cover artwork: ribbon, logo, name bar) from the cover template PDF.
# Needs Python with pypdf, Pillow and numpy, and poppler's pdftoppm. Three steps:
#   1. strip the live text from the template:
#        python -c "from pypdf import PdfReader, PdfWriter; w = PdfWriter(); w.append(PdfReader('brief/cover-template-2026-11.pdf')); w.remove_text(); w.write('notext.pdf')"
#   2. render it in its own CMYK:   pdftoppm -r 250 -jpegcmyk notext.pdf cmyk
#   3. convert:                     python tools/cover-artwork.py cmyk-1.jpg assets/cover-2026.jpg
#
# CMYK page render -> sRGB cover background.
# The PDF is DeviceCMYK with no colour profile, and poppler's built-in conversion turns the brand blue
# violet. This converts ink by ink with ramps close to a coated-paper press profile (the values a
# design tool shows for C, M, Y, K tints), multiplied together. Checked against the brand blue of
# the logo asset: C73 M23 -> about #279BD6.
import sys
import numpy as np
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src); assert im.mode == 'CMYK'
a = np.asarray(im).astype(np.float32)          # 0 = no ink, 255 = full ink
H, W, _ = a.shape

# remove the white dot painted on the name bar (the report draws its own, after the name)
bar = a[int(H * .655):int(H * .73), int(W * .08):int(W * .92)]
ys, xs = np.where(bar.sum(axis=2) < 12)
if len(ys):
    y0, y1, x0, x1 = ys.min() + int(H * .655), ys.max() + int(H * .655), xs.min() + int(W * .08), xs.max() + int(W * .08)
    pad = 6; y0 -= pad; y1 += pad; x0 -= pad; x1 += pad
    hgt = y1 - y0 + 1
    a[y0:y1 + 1, x0:x1 + 1] = a[y0 - hgt - 4:y0 - 4, x0:x1 + 1]     # same columns, just above: the bar's gradient runs left to right
    print('dot removed at px', (x0 + x1) / 2, (y0 + y1) / 2, 'size', x1 - x0 - 2 * pad, 'of', W, H)

ramps = {  # ink coverage % -> sRGB
    0: ([0, 20, 50, 70, 100], [(255, 255, 255), (199, 234, 251), (109, 207, 246), (44, 190, 240), (0, 174, 239)]),      # cyan
    1: ([0, 50, 100], [(255, 255, 255), (244, 154, 193), (236, 0, 140)]),                                                # magenta
    2: ([0, 50, 100], [(255, 255, 255), (255, 247, 153), (255, 242, 0)]),                                                # yellow
    3: ([0, 10, 50, 100], [(255, 255, 255), (230, 231, 232), (147, 149, 152), (35, 31, 32)]),                            # black
}
rgb = np.ones((H, W, 3), np.float32)
for ink, (xs_, cols) in ramps.items():
    cov = a[..., ink] / 2.55
    for ch in range(3):
        rgb[..., ch] *= np.interp(cov, xs_, [c[ch] for c in cols]) / 255.0
Image.fromarray(np.clip(rgb * 255 + .5, 0, 255).astype(np.uint8), 'RGB').save(out, quality=90, subsampling=0)

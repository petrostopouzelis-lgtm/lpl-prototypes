"""Makes the report covers the generator uses, from the design system's covers, until the editable covers arrive.

    python teique-ff/tools/clean-covers.py

The design system's covers (design-system/assets/report-covers/) have a placeholder name ("John Smith") in the
name card and an old copyright line ("Copyright (c) K. V. Petrides/LPL 1998 - 2022") in the picture. This takes
both out and records where they were, so the report puts its own as live text (Petros, 2026-11-28):
  - the copyright line is painted over with the background above and below it, column by column;
  - the name card (and its shadow) is painted over the same way; the report draws a new card in the same place,
    the same size or wider for a long name, with the report title and the person's name.
Writes assets/covers/<cover>.png and assets/covers/layout.json (positions in points on the 595 x 842 page).
"""
import json, os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, '..', 'design-system', 'assets', 'report-covers')
OUT = os.path.join(ROOT, 'assets', 'covers')
COVERS = ['personal', 'corporate', 'leadership', 'developmental', 'recruitment']
PT = 842 / 3508          # points per pixel (the covers are 2481 x 3508, A4 at 300 dpi)


def runs(idx, gap=3):
    out, s, p = [], idx[0], idx[0]
    for r in idx[1:]:
        if r > p + gap:
            out.append((s, p)); s = r
        p = r
    return out + [(s, p)]


def fill_rows(a, y0, y1, x0, x1, keep_colour=False):
    """Paint rows y0..y1 (columns x0..x1) with a blend of the row above and the row below, column by column.
    keep_colour: leave the illustration's coloured pixels as they are, and never blend a coloured edge pixel in
    (so a figure reaching into the area keeps its shape and leaves no streak)."""
    top, bot = a[y0 - 1, x0:x1 + 1].astype(float), a[y1 + 1, x0:x1 + 1].astype(float)
    if keep_colour:
        sat = lambda p: (p.max(axis=-1) - p.min(axis=-1)) > 30
        top, bot = np.where(sat(top)[:, None], bot, top), np.where(sat(bot)[:, None], top, bot)
    for y in range(y0, y1 + 1):
        t = (y - y0 + 1) / (y1 - y0 + 2)
        new = (top * (1 - t) + bot * t).round()
        if keep_colour:
            old = a[y, x0:x1 + 1].astype(int)
            new = np.where(((old.max(axis=-1) - old.min(axis=-1)) > 30)[:, None], old, new)
        a[y, x0:x1 + 1] = new


def hexc(c):
    return '#%02X%02X%02X' % tuple(int(v) for v in c)


os.makedirs(OUT, exist_ok=True)
layout = {}
for name in COVERS:
    im = Image.open(os.path.join(SRC, name + '.png')).convert('RGB')
    a = np.asarray(im).copy()
    mn = a.astype(int).min(axis=2)
    # ---- the name card: its two text lines (title, name), then its white edges
    zone = mn[1200:1600, 750:1750] < 200
    lines = runs(np.where(zone.any(axis=1))[0] + 1200)
    (t0, t1), (n0, n1) = lines[0], lines[-1]
    xs = np.where(zone.any(axis=0))[0] + 750
    tx0, tx1 = xs.min(), xs.max()
    row = mn[(t0 + n1) // 2]
    cx0 = tx0
    while row[cx0 - 1] >= 252: cx0 -= 1
    cx1 = tx1
    while row[cx1 + 1] >= 252: cx1 += 1
    col = mn[:, min(tx1 + 15, cx1 - 30)]
    cy0 = t0
    while col[cy0 - 1] >= 252: cy0 -= 1
    cy1 = n1
    while col[cy1 + 1] >= 252: cy1 += 1
    title_rgb = np.median(a[t0:t1 + 1, 750:1750][a[t0:t1 + 1, 750:1750].min(axis=2) < 120], axis=0)
    # paint out the card and its soft shadow, which fades out about 90 px from the card
    # (the card itself first: its white face with the title and name goes entirely; round it, the illustration's
    # coloured pixels stay)
    a[cy0:cy1 + 1, cx0:cx1 + 1] = 255
    fill_rows(a, cy0 - 95, cy1 + 95, cx0 - 95, cx1 + 95, keep_colour=True)
    # ---- the copyright line, in the bottom 90 px: pixels unlike the background just above and below the band
    y0, y1 = 3424, 3492
    loc = ((a[y0 - 14:y0 - 6].astype(int).mean(axis=0) + a[y1 + 4:y1 + 12].astype(int).mean(axis=0)) / 2)[None]
    diff = np.abs(a[y0:y1 + 1].astype(int) - loc).max(axis=2) > 30
    ys, xs = np.where(diff)
    ry0, ry1, rx0, rx1 = ys.min() + y0, ys.max() + y0, xs.min(), xs.max()
    cr_rgb = np.median(a[ry0:ry1 + 1, rx0:rx1 + 1][diff[ry0 - y0:ry1 - y0 + 1, rx0:rx1 + 1]], axis=0)
    fill_rows(a, ry0 - 4, ry1 + 4, max(0, rx0 - 8), min(a.shape[1] - 1, rx1 + 8))
    Image.fromarray(a).save(os.path.join(OUT, name + '.png'), optimize=True)
    r = lambda v: round(float(v) * PT, 1)
    layout[name] = {
        'image': name + '.png',
        # card: left/top/width/height of the white card; the title's cap top and the name's baseline
        'card': {'x': r(cx0), 'y': r(cy0), 'w': r(cx1 - cx0 + 1), 'h': r(cy1 - cy0 + 1),
                 'title_cap_top': r(t0), 'title_cap': r(t1 - t0 - (t1 - t0) * 0.22), 'name_baseline': r(n1 + 1), 'name_cap': r(n1 - n0 + 1),
                 'accent': hexc(title_rgb)},
        # copyright: centre, baseline (its text runs from ry0 to ry1, descenders included) and colour
        'copyright': {'cx': r((rx0 + rx1) / 2), 'top': r(ry0), 'bottom': r(ry1 + 1), 'color': hexc(cr_rgb)},
    }
    print(name, layout[name])
json.dump(layout, open(os.path.join(OUT, 'layout.json'), 'w'), indent=2)

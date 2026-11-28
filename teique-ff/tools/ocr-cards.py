"""Reads the text cards of a 2025 TEIQue sample report, which are pictures, not text.

    python teique-ff/tools/ocr-cards.py <report.pdf> <out.json> [--ocrlib <dir>] [--rgb]

--rgb: the cards hold their text in the colour picture, not in the transparency mask (the Recruitment
report's cards: dark text on white, white text on colour). The text is then read from how far each pixel
is from the card's own colour.

In the samples, each white text card (the interpretation on a scale page, development cards...) is an
image whose transparency mask holds the text shapes. For every large image on every page this script
takes the mask, cuts it into lines where the rows are empty, reads each line with OCR (RapidOCR, which
needs onnxruntime; --ocrlib points at a folder where it was installed with pip --target) and joins lines
into paragraphs at the larger gaps. Known OCR slips in this typeface are corrected (TElQue -> TEIQue,
El -> EI). The result must still be checked against the page by eye before it goes into a text library.
"""
import json, os, re, subprocess, sys, tempfile

args = sys.argv[1:]
RGB = '--rgb' in args
if RGB:
    args.remove('--rgb')
if '--ocrlib' in args:
    i = args.index('--ocrlib'); sys.path.insert(0, args[i + 1]); del args[i:i + 2]
src, out = args[0], args[1]

import numpy as np
from PIL import Image, ImageOps
from rapidocr_onnxruntime import RapidOCR

eng = RapidOCR()
REVIEW = []     # doubtful lines, to check by eye
FIX = [(r'\bTElQue', 'TEIQue'), (r'\bTEIQue\b', 'TEIQue'), (r'\bEl\b', 'EI'), (r'\bTSlQue', 'TSIQue'), (r'\s+([,.;:)])', r'\1'), (r'\(\s+', '(')]


def lines_of(mask):
    """Rows of text in a mask image (text bright on dark), as (top, bottom) pairs."""
    a = np.asarray(mask, dtype=np.uint8)
    h, w = a.shape
    # look only inside the card: drop the soft shadow round the edge
    core = a[:, int(w * 0.06):int(w * 0.94)]
    ink = (core > 128).sum(axis=1)
    rows, inrow, start = [], False, 0
    for y, n in enumerate(ink):
        if n > 2 and not inrow:
            inrow, start = True, y
        elif n <= 2 and inrow:
            inrow = False
            if y - start > 6:
                rows.append((start, y))
    return rows


def read_line(mask, t, b):
    """One line of text. Read whole; a very wide line is sometimes squeezed too hard for the recogniser
    and dropped, so then it is cut at the word gap nearest the middle and the halves are read (and a
    half that is still dropped, in quarters). Returns the text and the lowest confidence."""
    band = np.asarray(mask.crop((0, t, mask.width, b))) > 128
    colink = band.any(axis=0)
    cols = np.where(colink)[0]
    if not len(cols):
        return '', 0
    gap_min = max(12, int((b - t) * 0.4))      # word gaps are over half the line height, letter gaps under a quarter

    def rec(a_, b_):
        crop = ImageOps.invert(mask.crop((max(0, a_ - 10), max(0, t - 6), min(mask.width, b_ + 10), min(mask.height, b + 6)))).convert('RGB')
        res, _ = eng(np.array(crop), use_det=False, use_cls=False, use_rec=True)
        return ' '.join(r[1].strip() for r in (res or [])).strip(), min([float(r[2]) for r in (res or [])] or [0])

    def split(a_, b_):
        gaps, run = [], 0
        for x in range(a_, b_):
            if not colink[x]:
                run += 1
            else:
                if run >= gap_min:
                    gaps.append((x - run, x))
                run = 0
        if not gaps:
            return None
        mid = (a_ + b_) // 2
        return min(gaps, key=lambda g: abs((g[0] + g[1]) // 2 - mid))

    def go(a_, b_, depth):
        text, conf = rec(a_, b_)
        if text or depth == 0:
            return (text or '[?]'), (conf if text else 0)
        g = split(a_, b_)
        if not g:
            return '[?]', 0
        (t1, c1), (t2, c2) = go(a_, g[0], depth - 1), go(g[1], b_, depth - 1)
        return t1 + ' ' + t2, min(c1, c2)

    return go(int(cols[0]), int(cols[-1]) + 1, 2)


def read(mask_path):
    mask = Image.open(mask_path).convert('L')
    a = np.asarray(mask)
    # the card itself is dark in the mask and the text bright; outside the card it is a glow: keep the card's inside
    rows = lines_of(mask)
    if not rows:
        return []
    heights = sorted(b - t for t, b in rows)
    lh = heights[len(heights) // 2]
    paras, cur, last_bottom = [], [], None
    for t, b in rows:
        if b - t < lh * 0.5 or b - t > lh * 2.2:       # stray marks, or the card edge
            continue
        if (a[t:b] > 128).any(axis=0).mean() > 0.8:      # a solid band (card edge), not a line of text
            continue
        text, conf = read_line(mask, t, b)
        if not text.strip():
            text, conf = '[?]', 0
        # doubtful: low confidence, a lost piece, or words run together
        if conf < 0.8 or '[?]' in text:
            REVIEW.append({'mask': mask_path, 'top': t, 'bottom': b, 'ocr': text, 'conf': round(conf, 3)})
        if last_bottom is not None and t - last_bottom > lh * 1.2 and cur:
            paras.append(' '.join(cur)); cur = []
        cur.append(text.strip()); last_bottom = b
    if cur:
        paras.append(' '.join(cur))
    fixed = []
    for p in paras:
        p = re.sub(r'(\w)- (\w)', r'\1\2', p) if False else p
        for a_, b_ in FIX:
            p = re.sub(a_, b_, p)
        fixed.append(p)
    return fixed


def main():
    tmp = tempfile.mkdtemp(prefix='cards-')
    listing = subprocess.run(['pdfimages', '-list', src], capture_output=True, text=True).stdout.splitlines()[2:]
    big = [l.split() for l in listing if len(l.split()) > 5 and l.split()[2] == 'smask' and int(l.split()[3]) > 1500 and int(l.split()[4]) > 300]
    pages = {}
    for f in big:
        page, num = int(f[0]), int(f[1])
        stem = os.path.join(tmp, f'p{page:02d}')
        subprocess.run(['pdfimages', '-f', str(page), '-l', str(page), '-png', src, stem], capture_output=True)
        # pdfimages numbers images per call from 000: find this page's masks by size
        pass
    # second pass: every page's images, masks only, in page order
    for page in sorted({int(f[0]) for f in big}):
        stem = os.path.join(tmp, f'p{page:02d}')
        files = sorted(x for x in os.listdir(tmp) if x.startswith(f'p{page:02d}-'))
        cards = []
        for x in files:
            im = Image.open(os.path.join(tmp, x))
            if im.mode == 'L' and im.width > 1500 and im.height > 300:
                path = os.path.join(tmp, x)
                if RGB:
                    # the colour picture is the image just before its mask: text = distance from the card colour
                    n = int(x.split('-')[1].split('.')[0])
                    rgb = np.asarray(Image.open(os.path.join(tmp, f'p{page:02d}-{n - 1:03d}.png')).convert('RGB')).astype(int)
                    inside = np.asarray(im) > 200
                    bg = np.median(rgb[inside], axis=0)
                    dist = np.abs(rgb - bg).max(axis=2) * inside
                    path = os.path.join(tmp, f'text-{x}')
                    Image.fromarray(np.clip(dist * 1.3, 0, 255).astype(np.uint8)).save(path)
                paras = read(path)
                if paras:
                    cards.append(paras)
        pages[page] = cards
        print(f'page {page}: {len(cards)} card(s), {sum(len(c) for c in cards)} paragraph(s)')
    # pictures of the doubtful lines, with what OCR read, for checking by eye
    rev_dir = os.path.splitext(out)[0] + '-review'
    os.makedirs(rev_dir, exist_ok=True)
    for i, r in enumerate(REVIEW):
        m = Image.open(r['mask']).convert('L')
        ImageOps.invert(m.crop((0, max(0, r['top'] - 8), m.width, min(m.height, r['bottom'] + 8)))).save(os.path.join(rev_dir, f'{i:03d}.png'))
        r['image'] = f'{i:03d}.png'; r['page'] = int(os.path.basename(r['mask']).replace('text-', '')[1:3]); del r['mask']
    json.dump({'source': os.path.basename(src), 'pages': {str(k): v for k, v in pages.items()}, 'review': REVIEW}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(REVIEW), 'lines to check by eye in', rev_dir)


main()

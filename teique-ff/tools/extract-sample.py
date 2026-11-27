"""Reads a 2025 TEIQue sample report PDF into clean text, page by page, without the sample watermark.

    python teique-ff/tools/extract-sample.py <report.pdf> <out.json>

The samples carry a "London Psychometric Laboratory Sample" watermark that text extraction mixes into
the report's own lines. The watermark is set in Poppins (and in text with no font), the report in Inter,
so only Inter text is kept. Lines are rebuilt from the text's position on the page, and paragraphs from
the gaps between lines. Each block keeps its font and size, so headings, lead lines and body text can be
told apart. Needs pypdf.
"""
import json, re, sys
from pypdf import PdfReader


def runs_of(page):
    runs = []

    def visit(text, cm, tm, fontdict, size):
        if not text or not text.strip():
            return
        font = str((fontdict or {}).get('/BaseFont', '')) if fontdict else ''
        if not font or 'Poppins' in font:          # the watermark
            return
        if 'Inter-Regular' in font:                # the score wheel's Low / Average / High labels
            return
        x = tm[4] * cm[0] + tm[5] * cm[2] + cm[4]
        y = tm[4] * cm[1] + tm[5] * cm[3] + cm[5]
        scale = (tm[0] or 1) * (cm[0] or 1)
        runs.append({'text': text, 'x': x, 'y': y, 'font': font.split('+')[-1], 'size': round(size * scale, 1)})

    page.extract_text(visitor_text=visit)
    return runs


def lines_of(runs):
    """Group runs into lines (same baseline), top to bottom, each line left to right."""
    lines = []
    for r in sorted(runs, key=lambda r: (-round(r['y'], 0), r['x'])):
        for part in r['text'].split('\n'):
            if not part.strip():
                continue
            if lines and abs(lines[-1]['y'] - r['y']) < 1.5 and lines[-1]['font'] == r['font'] and lines[-1]['size'] == r['size']:
                lines[-1]['text'] += part
            else:
                lines.append({'text': part, 'y': r['y'], 'x': r['x'], 'font': r['font'], 'size': r['size']})
    return lines


JOINS = []


def blocks_of(lines):
    """Join lines into paragraphs: same font and size, and no bigger gap than about one and a half lines."""
    blocks = []
    for ln in lines:
        text = re.sub(r'\s+', ' ', ln['text']).strip()
        if not text:
            continue
        b = blocks[-1] if blocks else None
        same = b and b['font'] == ln['font'] and b['size'] == ln['size'] and (b['y'] - ln['y']) < ln['size'] * 1.75
        if same:
            # a line ending in a hyphen: keep the hyphen (Self-esteem, Well-being) and note the join to check
            if b['text'].endswith('-') and not b['text'].endswith(' -'):
                JOINS.append(b['text'].split(' ')[-1] + text.split(' ')[0])
                b['text'] += text
            else:
                b['text'] += ' ' + text
            b['y'] = ln['y']
        else:
            blocks.append({'text': text, 'y': ln['y'], 'top': ln['y'], 'x': round(ln['x'], 1), 'font': ln['font'], 'size': ln['size']})
    for b in blocks:
        b['text'] = re.sub(r'\s+', ' ', b['text']).strip()
        b['top'] = round(b['top'], 1)
        del b['y']
    return blocks


def main(src, out):
    reader = PdfReader(src)
    pages = []
    for i, page in enumerate(reader.pages, 1):
        pages.append({'page': i, 'blocks': blocks_of(lines_of(runs_of(page)))})
    json.dump({'source': src.split('/')[-1], 'pages': pages}, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{len(pages)} pages -> {out}')
    print('words joined across a line-end hyphen (check each):', sorted(set(JOINS)))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

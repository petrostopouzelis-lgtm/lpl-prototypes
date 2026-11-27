"""Checks a built Full Form report's wording against the 2025 sample, both ways.

    python teique-ff/tools/audit-text.py [built.pdf]      (default: out/sample-ff.pdf, built from data/sample-ff.json)

1. Sample -> built report: every block of the sample's own text (reference/personal-text-layer.json) and
   every interpretation card (text/library.json, proofread from the card pictures) is in the built report.
2. Built report -> sample: once all of that is taken out, what is left of the built report is only names,
   numbers, chart labels and the Figma labels listed in FIGMA (printed, for a person to read over).

Text is compared as lower-case letters and digits only, so line breaks, hyphenation, quote styles and
spacing do not count; words do. Needs pypdf.
"""
import json, os, re, sys
from pypdf import PdfReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
pdf = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'out', 'sample-ff.pdf')
key = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())

built = key(' '.join(p.extract_text() or '' for p in PdfReader(pdf).pages))
layer = json.load(open(os.path.join(ROOT, 'reference/personal-text-layer.json'), encoding='utf-8'))
lib = json.load(open(os.path.join(ROOT, 'text/library.json'), encoding='utf-8'))

# Text on the sample's pages that the built report does not repeat on purpose:
SKIP = {
    'Personal', 'Report',            # cover: the cover template sets "Personal Report" as one line
    'CONTENTS',                      # contents title: Figma's "Contents" (letters compare the same)
}
sample_blocks = []
for page in layer['pages']:
    for b in page['blocks']:
        t = b['text']
        if t in SKIP or t == 'Page' or t.isdigit() or t.startswith('©') or t == 'Maria Green':
            continue
        sample_blocks.append((page['page'], t))
cards = [(sid, band, t) for sid, s in lib['scales'].items() for band, t in s['interpretation']['personal'].items() if t]
cards += [('structure', 'scores', t) for t in lib['pages']['structure']['scores']]
cards += [('uses', 'item', t) for t in lib['pages']['uses']['items']]

missing = [(p, t) for p, t in sample_blocks if key(t) not in built]
missing += [(f'{sid}/{band}', t) for sid, band, t in cards for para in t.split('\n\n') if key(para) not in built]
print(f'1. sample -> built: {len(sample_blocks)} text blocks and {len(cards)} card texts checked, {len(missing)} missing')
for where, t in missing:
    print(f'   MISSING ({where}): {t[:110]}')

# 2. take out everything from the sample (longest first), then the known labels, and show what is left
rest = built
for t in sorted([t for _, t in sample_blocks] + [p for _, _, t in cards for p in t.split('\n\n')], key=len, reverse=True):
    rest = rest.replace(key(t), ' ')
# words from the Figma frames and the cover template (listed in text/library.json with their source)
FIGMA = ['TEIQuePersonal', 'YourScore', 'YourTEIQueWheelChart', 'YourTEIQueSummaryGraph', 'Contents', 'PersonalReport', 'FullForm',
         'IntroductiontoYourTEIQueReport', 'WellBeingFactor', 'SelfControlFactor', 'EmotionalityFactor', 'SociabilityFactor',
         'TraitEmotionalIntelligence']
# labels that are not sample sentences: running header and footer, scale names, band names, numbers
names = ['Global Score', 'Well-Being', 'Self-Control', 'Emotionality', 'Sociability', 'Independent Facets'] + [s['title'] for s in lib['scales'].values()]
ct = lib['pages']['contents']   # the sample's contents page is a picture: its entries are copied in the library
labels = FIGMA + names + [ct[k] for k in ('intro', 'wheel', 'summary', 'global', 'independent')] + ['TEIQue Personal Report Full Form']
labels += lib['footer']['copyright'].split('{year}') + [lib['footer']['legal'], 'Low', 'Average', 'High', 'page']
labels += [json.load(open(os.path.join(ROOT, 'data', d), encoding='utf-8'))['subject']['name'] for d in os.listdir(os.path.join(ROOT, 'data')) if d.endswith('.json')]
rest = re.sub(r'\d+', ' ', rest)
for t in sorted({key(x) for x in labels}, key=len, reverse=True):
    rest = rest.replace(t, ' ')
pieces = sorted({p for p in rest.split(' ') if p})
print(f'2. built -> sample: {len(pieces)} piece(s) of the built report are neither sample text nor a known label' + (':' if pieces else ''))
for p in pieces:
    print('   NOT IN SAMPLE: ' + p[:200])
sys.exit(1 if missing or pieces else 0)

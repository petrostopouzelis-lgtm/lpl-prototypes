"""Checks a built Full Form report's wording against its 2025 sample, both ways.

    python teique-ff/tools/audit-text.py [version] [built.pdf]
      version    personal (default), corporate or leadership
      built.pdf  default: out/<the version's sample data file>.pdf, e.g. out/sample-ff-corporate.pdf

1. Sample -> built report: every block of the sample's own text (reference/<version>-text-layer.json) and
   every interpretation card (text/library.json, proofread from the card pictures) is in the built report.
2. Built report -> sample: once all of that is taken out, what is left of the built report is only names,
   numbers, chart labels and the Figma labels listed in FIGMA. Anything else is printed and fails the check.

Text is compared as lower-case letters and digits only, so line breaks, hyphenation, quote styles and
spacing do not count; words do. Needs pypdf.
"""
import json, os, re, sys
from pypdf import PdfReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAMPLES = {'personal': 'sample-ff', 'corporate': 'sample-ff-corporate', 'leadership': 'sample-ff-leadership',
           'developmental': 'sample-ff-developmental', 'recruitment': 'sample-ff-recruitment'}
args = sys.argv[1:]
ver = args[0] if args and args[0] in SAMPLES else 'personal'
pdf = next((a for a in args if a.endswith('.pdf')), os.path.join(ROOT, 'out', SAMPLES[ver] + '.pdf'))
key = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())

built = key(' '.join(p.extract_text() or '' for p in PdfReader(pdf).pages))
layer = json.load(open(os.path.join(ROOT, f'reference/{ver}-text-layer.json'), encoding='utf-8'))
lib = json.load(open(os.path.join(ROOT, 'text/library.json'), encoding='utf-8'))
V = lib['versions'][ver]
person = json.load(open(os.path.join(ROOT, 'data', SAMPLES[ver] + '.json'), encoding='utf-8'))['subject']['name']

# Text on the sample's pages that the built report does not repeat on purpose:
SKIP = {
    V['name'], 'Report',             # cover: the cover template sets "<Version> Report" as one line
    'CONTENTS',                      # contents title: Figma's "Contents" (letters compare the same)
    person,                          # the sample person's name (cover)
}
sample_blocks = []
for page in layer['pages']:
    for b in page['blocks']:
        t = b['text']
        if t in SKIP or t == 'Page' or t.isdigit() or t.startswith('©'):
            continue
        # the wheel and the summary graph: the charts' own labels, drawn by the report's charts; only the quote
        # under the wheel is wording
        charts = {'developmental': (4, 5), 'recruitment': (4,)}.get(ver, (6, 7))
        if page['page'] in charts and not ('Medium' in b['font'] and b['size'] > 9):
            continue
        # Developmental: the sample prints factor names in capitals ("WELL-BEING"); the report uses Figma's titles
        if ver == 'developmental' and t.isupper() and 'Medium' in b['font']:
            continue
        sample_blocks.append((page['page'], t))
def flat(o):
    """Every string inside a library entry."""
    if isinstance(o, str): return [o] if o.strip() else []
    if isinstance(o, list): return [x for i in o for x in flat(i)]
    if isinstance(o, dict): return [x for k, i in o.items() if k not in ('source', 'flag', 'title_source') for x in flat(i)]
    return []
if ver == 'recruitment':
    # the sample's own cards, as transcribed (the report builds the opening sentence and the average text itself)
    rc = json.load(open(os.path.join(ROOT, 'reference/recruitment-cards.json'), encoding='utf-8'))['cards']
    cards = [(sid, 'card', p) for sid, c in rc.items() for p in c['paragraphs']]
elif ver == 'developmental':
    cards = [(sid, band, p) for sid, s in V['scales'].items() for band, t in s['interpretation'].items() if t for p in flat(t)]
else:
    cards = [(sid, band, t) for sid, s in V['scales'].items() for band, t in s['interpretation'].items() if t]
    cards += [('structure', 'scores', t) for t in V['pages']['structure']['scores']]
    cards += [('uses', 'item', t) for t in V['pages']['uses']['items']]

missing = [(p, t) for p, t in sample_blocks if key(t) not in built]
missing += [(f'{sid}/{band}', para) for sid, band, t in cards for para in t.split('\n\n') if key(para) not in built]
print(f'{ver} ({os.path.basename(pdf)})')
print(f'1. sample -> built: {len(sample_blocks)} text blocks and {len(cards)} card texts checked, {len(missing)} missing')
for where, t in missing:
    print(f'   MISSING ({where}): {t[:110]}')

# 2. take out everything from the sample (longest first), then the known labels, and show what is left
rest = built
for t in sorted([t for _, t in sample_blocks] + [p for _, _, t in cards for p in t.split('\n\n')], key=len, reverse=True):
    rest = rest.replace(key(t), ' ')
# words from the Figma frames and the cover template (listed in text/library.json with their source)
FIGMA = ['TEIQue ' + V['header'], 'Auxiliary Facets', 'YourScore', 'YourTEIQueWheelChart', 'YourTEIQueSummaryGraph', 'Contents', V['cover'], 'FullForm',
         'WellBeingFactor', 'SelfControlFactor', 'EmotionalityFactor', 'SociabilityFactor', 'TraitEmotionalIntelligence']
# labels that are not sample sentences: running header and footer, scale names, band names, numbers
names = ['Global Score', 'Well-Being', 'Self-Control', 'Emotionality', 'Sociability', 'Independent Facets'] + [s['title'] for s in V['scales'].values() if 'title' in s]
names += [s['title'] for s in lib['versions']['personal']['scales'].values()]   # the charts' labels use the plain scale names
ct = V['pages']['contents']   # the sample's contents page is a picture: its entries are copied in the library
labels = FIGMA + names + flat(ct) + [f"TEIQue {V['cover']} Full Form"]
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

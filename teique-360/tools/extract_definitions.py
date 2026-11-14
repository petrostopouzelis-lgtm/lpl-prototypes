"""Builds text/library.json from the 2025 TEIQue sample report PDF.

Only the scale definitions (and the coloured lead line on factor pages) can be read
from the PDF. Interpretation and development text is left empty, marked "needed".
Usage: python extract_definitions.py <report.pdf> <out.json>   (needs PyMuPDF)
"""
import json, re, sys
import pymupdf

PAGES = {  # page number in the 2025 sample -> scale id
    8: 'global', 9: 'wellbeing', 10: 'happiness', 11: 'optimism', 12: 'self_esteem',
    13: 'self_control', 14: 'emotion_regulation', 15: 'impulse_control', 16: 'stress_management',
    17: 'emotionality', 18: 'empathy', 19: 'emotion_perception', 20: 'emotion_expression', 21: 'relationships',
    22: 'sociability', 23: 'emotion_management', 24: 'assertiveness', 25: 'social_awareness',
    26: 'adaptability', 27: 'self_motivation',
}
SPLIT = {'global': 'It is an index', 'wellbeing': 'The factor is more basic', 'self_control': 'The factor is more basic',
         'emotionality': 'The factor is more basic', 'sociability': 'The factor is more basic'}

def join(lines):
    text = ''
    for ln in lines:
        ln = ln.strip()
        if not ln: continue
        text += ln if (not text or text.endswith('-')) else ' ' + ln
    return re.sub(r'\s+', ' ', text).strip()

doc = pymupdf.open(sys.argv[1])
scales = {}
for page, sid in PAGES.items():
    lines = doc[page - 1].get_text().splitlines()
    body = []
    for ln in lines[1:]:
        if ln.strip() in ('High', 'Low', 'Average') or ln.startswith('©'): break
        body.append(ln)
    text = join(body)
    lead = ''
    if sid in SPLIT and SPLIT[sid] in text:
        i = text.index(SPLIT[sid]); lead, text = text[:i].strip(), text[i:].strip()
    blank = {'low': '', 'average': '', 'high': ''}
    scales[sid] = {
        'lead': lead, 'definition': text,
        'interpretation': {'self': dict(blank), 'others': dict(blank)},
        'development': {'low': [], 'high': []},
        'status': {'definition': 'from 2025 sample', 'interpretation': 'needed', 'development': 'needed'},
    }
library = {
    'schema': 'teique-360-text/1', 'language': 'en', 'audience': 'corporate',
    'notes': 'Definitions are copied from the 2025 Personal Counselling sample; confirm they match the Corporate text. '
             'Comparison sentences are drafts and need LPL sign-off.',
    'comparison': {
        'agree': 'Your own view and the view of your raters are closely aligned on this scale.',
        'others_higher': 'Your raters see more of this in you than you see in yourself.',
        'self_higher': 'You rate yourself higher on this scale than your raters do.',
        'agree_within': 10, 'status': 'draft',
    },
    'scales': scales,
}
# Keep everything already in the library (page copy, interpretation and development text).
# Only the definitions and lead lines are refreshed from the PDF.
import os
if os.path.exists(sys.argv[2]):
    with open(sys.argv[2], encoding='utf-8') as f:
        old = json.load(f)
    for sid, s in scales.items():
        prev = old.get('scales', {}).get(sid)
        if prev:
            lead, definition = s['lead'], s['definition']
            s.clear(); s.update(prev); s['lead'], s['definition'] = lead, definition
    library = {**old, 'scales': scales}
with open(sys.argv[2], 'w', encoding='utf-8') as f:
    json.dump(library, f, indent=2, ensure_ascii=False); f.write('\n')
for sid, s in scales.items():
    print(f"{sid:20s} lead {len(s['lead']):4d}  definition {len(s['definition']):4d}  {s['definition'][:60]!r}")

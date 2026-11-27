"""Builds text/library.json (all report wording) from the extracted 2025 sample text.

    python teique-ff/tools/build-library.py

Sources, both made from the TEIQue-FF Personal/Counselling sample (2025/Samples/...):
  reference/personal-text-layer.json   the PDF's own text (tools/extract-sample.py): titles, introduction
                                       pages, the lead line and definition of every scale
  reference/personal-cards-ocr.json    the text cards, which are pictures (tools/ocr-cards.py): the
                                       interpretation of every scale, and the score explanation

Every card was proofread against its picture (2026-11-27). OCR reads curly quotes and apostrophes as
straight ones, loses a full stop after a closing quote, runs a few words together and adds a space after
a line-end hyphen; TYPO fixes the first by rule, FIXES lists every other correction, word for word as the
sample prints it. Nothing here is new wording: a scale without sample text keeps an empty band, which
the report shows as "Text needed".
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
layer = json.load(open(os.path.join(ROOT, 'reference/personal-text-layer.json'), encoding='utf-8'))
cards = json.load(open(os.path.join(ROOT, 'reference/personal-cards-ocr.json'), encoding='utf-8'))['pages']
sample = json.load(open(os.path.join(ROOT, 'data/sample-ff.json'), encoding='utf-8'))

# page of the sample -> scale id (pages 8 to 27, one scale per page)
PAGES = {8: 'global', 9: 'wellbeing', 10: 'happiness', 11: 'optimism', 12: 'self_esteem', 13: 'self_control',
         14: 'emotion_regulation', 15: 'impulse_control', 16: 'stress_management', 17: 'emotionality',
         18: 'empathy', 19: 'emotion_perception', 20: 'emotion_expression', 21: 'relationships',
         22: 'sociability', 23: 'emotion_management', 24: 'assertiveness', 25: 'social_awareness',
         26: 'adaptability', 27: 'self_motivation'}


def band(score):
    return 'low' if score <= 30 else 'average' if score <= 70 else 'high'


def typo(t):
    """Typography the sample uses, which OCR flattens: curly apostrophes and quotes."""
    t = re.sub(r"(\w)'(\w)", r'\1’\2', t)                                 # don't -> don’t
    t = re.sub(r"(\w)s' ", r'\1s’ ', t)                                     # others' -> others’
    t = re.sub(r'"([^"]+)"', r'“\1”', t)                                     # "x" -> “x”
    t = re.sub(r"'([^']+)'", r'‘\1’', t)                                     # 'no' -> ‘no’
    return t


# Corrections from proofreading each card against its picture: (page, wrong, right).
FIXES = [
    (9, 'self- important', 'self-important'),
    (10, 'with - and adversely affects - many', 'with – and adversely affects – many'),
    (12, 'weak self- esteem', 'weak self-esteem'),
    (13, 'Weak Self- control', 'Weak Self-control'),
    (15, '““analysis paralysis” Your', '“analysis paralysis”. Your'),
    (16, 'complacent intheirmidst.', 'complacent in their midst.'),
    (17, 'spill over - to various degrees - into', 'spill over – to various degrees – into'),
    (18, 'between “you” and the “other” You', 'between “you” and the “other”. You'),
    (19, 'in a rangeof circumstances', 'in a range of circumstances'),
    (25, 'most communicationobstacles.', 'most communication obstacles.'),
    (27, 'you could be Ok,', 'you could be OK,'),
]

# The score explanation card (page 4): its first two sentences sit beside the example score wheels and
# OCR does not reach them; copied from the picture.
SCORES_CARD = [
    'Your score is presented as a percentile, showing your position with reference to other people in the comparison norms. Percentile scores are banded in three tiers for ease of interpretation:',
    'It must be understood and born in mind that higher scores are not necessarily good or desirable and lower scores are not necessarily bad or undesirable. Low, average, and high scores all have positive as well as negative implications.',
]

# The "uses" page (page 5) lists areas in circles drawn as a picture; copied from it, in reading order.
USES = ['Selection and Recruitment', 'Academic Counselling and Performance', 'Career Counselling and Development',
        'Communication skills', 'Teamwork', 'Life Coaching', 'Benchmarking', 'Decision Making', 'Self Development',
        'Relationship Counselling', 'Work Engagement and Productivity', 'Mental Health and Resilience',
        'Performance Appraisals', 'Leadership and Management', 'Subconscious Reprogramming']


def blocks(page, font=None):
    out = []
    for b in layer['pages'][page - 1]['blocks']:
        if b['text'] in ('Page',) or b['text'].isdigit() or b['text'].startswith('©'):
            continue
        if font is None or font in b['font']:
            out.append(b)
    return out


def card_text(page):
    paras = [typo(p) for c in cards.get(str(page), []) for p in c]
    joined = '\n\n'.join(paras)
    for pg, wrong, right in FIXES:
        if pg == page:
            assert wrong in joined, (page, wrong)
            joined = joined.replace(wrong, right)
    return joined


lib = {
    'schema': 'teique-ff-text/1',
    'language': 'en',
    'source': 'TEIQue-FF Personal/Counselling Report [SAMPLE] (2025), word for word. Built by tools/build-library.py.',
    'footer': {'copyright': '© K. V. Petrides {year}. All rights reserved.', 'legal': 'A product of London Psychometric Laboratory Ltd.'},
    'versions': {
        'personal': {'name': 'Personal', 'cover': 'Personal Report', 'header': 'Personal'},
    },
    'pages': {},
    'scales': {},
}

# introduction (page 3)
p3 = blocks(3)
lib['pages']['intro'] = {'title': p3[0]['text'], 'paragraphs': [b['text'] for b in p3[1:]]}
# structure and scores (page 4)
p4 = blocks(4)
ocr4 = [typo(p) for c in cards.get('4', []) for p in c]
lib['pages']['structure'] = {
    'title': p4[0]['text'], 'paragraph': p4[1]['text'],
    'diagram_top': 'Trait Emotional Intelligence',
    'scores_title': p4[2]['text'],
    # the card: the two sentences beside the example wheels, then the OCR'd rest (its first paragraph
    # starts mid-sentence, after "...born in mind", so it is replaced by the full sentence above)
    'scores': SCORES_CARD + ocr4[1:],
}
# uses (page 5)
p5 = blocks(5)
lib['pages']['uses'] = {'title': p5[0]['text'], 'paragraph': p5[1]['text'], 'items': USES}
# wheel (page 6): the quote under the wheel
p6 = blocks(6)
lib['pages']['wheel'] = {'title': 'Your TEIQue Wheel Chart', 'quote': p6[0]['text'], 'quote_by': p6[1]['text'],
                         'title_source': 'Figma (the sample page has no title); contents entry: Wheel Chart'}
lib['pages']['summary'] = {'title': 'Your TEIQue Summary Graph',
                           'title_source': 'Figma (the sample page has no title); contents entry: Summary Graphs'}
# Figma-only labels (frames 238:323, 238:1542, 238:1578): the sample has no such words, or other ones.
lib['cover'] = {'report': 'Personal Report', 'form': 'Full Form',
                'source': 'cover template (teique-360/brief/cover-template-2026-11.pdf: TEIQue / Personal Report / Full Form)'}
lib['pages']['scale'] = {'your_score': 'Your Score', 'source': 'Figma global and factor pages (the sample has no heading above the card)'}
lib['pages']['contents'] = {'title': 'Contents', 'intro': 'Introduction', 'wheel': 'Wheel Chart', 'summary': 'Summary Graphs',
                            'global': 'Global Score', 'independent': 'Independent Facets'}

# scales (pages 8 to 27)
for page, sid in PAGES.items():
    bl = blocks(page)
    title = bl[0]['text']
    lead = next((b['text'] for b in bl[1:] if 'Medium' in b['font']), '')
    definition = '\n\n'.join(b['text'] for b in bl[1:] if 'Light' in b['font'])
    score = sample['self'][sid]
    interp = {'low': '', 'average': '', 'high': ''}
    interp[band(score)] = card_text(page)
    lib['scales'][sid] = {
        'title': title, 'lead': lead, 'definition': definition,
        'interpretation': {'personal': interp},
        'source': f'sample page {page}; interpretation for a score of {score} ({band(score)} band)',
    }

out = os.path.join(ROOT, 'text/library.json')
json.dump(lib, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
open(os.path.join(ROOT, 'text/library.js'), 'w', encoding='utf-8').write(
    '// Generated by tools/build-library.py from text/library.json. Do not edit.\nwindow.TEIQ_FF_TEXT = ' + json.dumps(lib, ensure_ascii=False, indent=2) + ';\n')
have = sum(1 for s in lib['scales'].values() for t in s['interpretation']['personal'].values() if t)
print(f'wrote text/library.json: {len(lib["scales"])} scales, {have} of {3 * len(lib["scales"])} interpretation texts')

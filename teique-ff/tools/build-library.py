"""Builds text/library.json (all report wording) from the extracted 2025 sample reports.

    python teique-ff/tools/build-library.py

One version of the report per 2025 sample (2025/Samples/Sample Reports 28-11-2025/):
  personal     TEIQue-FF Personal_Counselling Report [SAMPLE].pdf
  corporate    TEIQue-FF Corporate Report [SAMPLE].pdf
  leadership   TEIQue-FF Leadership Report [SAMPLE].pdf
For each, two files in reference/:
  <version>-text-layer.json   the PDF's own text (tools/extract-sample.py): titles, introduction pages, the
                              lead line and definition of every scale
  <version>-cards-ocr.json    the text cards, which are pictures (tools/ocr-cards.py): the interpretation of
                              every scale, and the score explanation

Every card was proofread against its picture (Personal 2026-11-27, Corporate and Leadership 2026-11-27).
OCR reads curly quotes and apostrophes as straight ones, adds a space after a line-end hyphen, runs some
words together and loses some full stops after a closing quote. TYPO and GENERIC fix the first two by rule;
FIXES lists every other correction, word for word as the samples print them. Nothing here is new wording:
a band the sample has no text for stays empty, and the report shows "Text needed" there.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ref = lambda name: json.load(open(os.path.join(ROOT, 'reference', name), encoding='utf-8'))
data = lambda name: json.load(open(os.path.join(ROOT, 'data', name), encoding='utf-8'))

# page of the sample -> scale id (pages 8 to 27, one scale per page; the same in every version)
PAGES = {8: 'global', 9: 'wellbeing', 10: 'happiness', 11: 'optimism', 12: 'self_esteem', 13: 'self_control',
         14: 'emotion_regulation', 15: 'impulse_control', 16: 'stress_management', 17: 'emotionality',
         18: 'empathy', 19: 'emotion_perception', 20: 'emotion_expression', 21: 'relationships',
         22: 'sociability', 23: 'emotion_management', 24: 'assertiveness', 25: 'social_awareness',
         26: 'adaptability', 27: 'self_motivation'}

VERSIONS = {
    'personal': {'name': 'Personal', 'cover': 'Personal Report', 'header': 'Personal', 'sample': 'sample-ff.json', 'cover_image': 'personal.png',
                 'pdf': 'TEIQue-FF Personal_Counselling Report [SAMPLE].pdf'},
    'corporate': {'name': 'Corporate', 'cover': 'Corporate Report', 'header': 'Corporate', 'sample': 'sample-ff-corporate.json', 'cover_image': 'corporate.png',
                  'pdf': 'TEIQue-FF Corporate Report [SAMPLE].pdf'},
    'leadership': {'name': 'Leadership', 'cover': 'Leadership Report', 'header': 'Leadership', 'sample': 'sample-ff-leadership.json', 'cover_image': 'leadership.png',
                   'pdf': 'TEIQue-FF Leadership Report [SAMPLE].pdf'},
}

# Headings inside a card (Leadership: each interpretation in two parts). Shown as headings, not paragraphs.
CARD_HEADINGS = ['Possible Positive', 'Possible Negative']


def band(score):
    return 'low' if score <= 30 else 'average' if score <= 70 else 'high'


GENERIC = [
    # a word broken at a line-end hyphen comes back with a space after the hyphen ("self- esteem"); a hyphen
    # followed by "or", "and" or "to" is a real one ("rules- or law-breaking", "long- and short-term")
    (r'(\w)- (?!(?:or|and|to)\b)(\w)', r'\1-\2'),
    (r'\bPossible(Positive|Negative)\b', r'Possible \1'),
]


def typo(t):
    """Typography the samples use, which OCR flattens: curly apostrophes and quotes."""
    t = re.sub(r"(\w)'(\w)", r'\1’\2', t)            # don't -> don’t
    t = re.sub(r"(\w)s'(?=[\s.,;:])", r'\1s’', t)     # others' -> others’
    t = re.sub(r'"([^"]+)"', r'“\1”', t)              # "x" -> “x”
    t = re.sub(r"'([^']+)'", r'‘\1’', t)              # 'no' -> ‘no’
    return t


# Corrections from proofreading each card against its picture: version -> [(page, OCR text, as printed)].
# They apply to the OCR text before GENERIC and TYPO.
FIXES = {
    'personal': [
        (10, 'with - and adversely affects - many', 'with – and adversely affects – many'),
        (15, '“"analysis paralysis" Your', '"analysis paralysis". Your'),
        (16, 'complacent intheirmidst.', 'complacent in their midst.'),
        (17, 'spill over - to various degrees - into', 'spill over – to various degrees – into'),
        (18, 'between "you" and the "other" You', 'between "you" and the "other". You'),
        (19, 'in a rangeof circumstances', 'in a range of circumstances'),
        (25, 'most communicationobstacles.', 'most communication obstacles.'),
        (27, 'you could be Ok,', 'you could be OK,'),
    ],
    'corporate': [
        (10, 'tough times - friends', 'tough times – friends'),
        (11, 'proneto overlook', 'prone to overlook'),
        (13, 'life domains - personal', 'life domains – personal'),
        (14, "slip into 'at jo ino deus eo nok 'spoo an!ebau perhaps", 'slip into negative moods, you can snap out of them, perhaps'),
        (15, 'in“analysis paralysis" In', 'in "analysis paralysis". In'),
        (18, 'between “you" and "them" You', 'between "you" and "them". You'),
        (19, "with feelings - your own or others' - which", "with feelings – your own or others' – which"),
        (22, 'ldentify which', 'Identify which'),
        (27, 'rewards tokeep', 'rewards to keep'),
    ],
    'leadership': [
        (4, 'hierarchies - indeed', 'hierarchies – indeed'),
        (9, 'vulnerableto change', 'vulnerable to change'),
        (10, 'unpreparedfortimely action', 'unprepared for timely action'),
        (11, 'produceresults', 'produce results'),
        (11, 'as naive or', 'as naïve or'),
        (13, 'reactions,lax', 'reactions, lax'),
        # page 15: OCR ran the whole card into one paragraph
        (15, 'Possible Positive You think', 'Possible Positive\n\nYou think'),
        (15, 'care and precision. You pay attention', 'care and precision.\n\nYou pay attention'),
        (15, 'consistent style. PossibleNegative Because', 'consistent style.\n\nPossible Negative\n\nBecause'),
        (15, 'timely actionsuch that', 'timely action—such that'),
        (15, 'miss opportunities. Discretion', 'miss opportunities.\n\nDiscretion'),
        (16, 'reassuringinfluence', 'reassuring influence'),
        (18, 'leadcohesiveteams', 'lead cohesive teams'),
        (19, 'theirneeds', 'their needs'),
        (23, '“"what makes people tick" you', '"what makes people tick" you'),
        (24, 'your firm [?] manager will', 'your firm authority, while your manager will'),
        (25, 'andleadacohesiveteam.', 'and lead a cohesive team.'),
        (26, "'shift gears, try", '‘shift gears’, try'),
        (26, 'open-even when', 'open—even when'),
        (26, 'finishtasks', 'finish tasks'),
    ],
}

# The score explanation card (page 4): its opening sits beside the example score wheels, where OCR does not
# reach; copied from the picture. The OCR'd rest follows (its first paragraph starts mid-sentence).
SCORES_OPENING = {
    'personal': [
        'Your score is presented as a percentile, showing your position with reference to other people in the comparison norms. Percentile scores are banded in three tiers for ease of interpretation:',
        'It must be understood and born in mind that higher scores are not necessarily good or desirable and lower scores are not necessarily bad or undesirable. Low, average, and high scores all have positive as well as negative implications.',
    ],
    'corporate': [
        'Simply put, the purpose of this report is to provide insights into your emotional perceptions and support your evolution to a higher level of self-awareness that will boost your personal and professional development. It will be up to you whether you choose to act on the information provided, igniting a process that can unlock the astonishing potential that lies dormant in you (as in every human being) or ignore it and continue as before.',
    ],
    'leadership': [
        'Your score is presented as a percentile, showing your position with reference to other people in the comparison norms. Percentile scores are banded in three tiers for ease of interpretation:',
        'It must be understood and born in mind that higher scores are not necessarily good or desirable and lower scores are not necessarily bad or undesirable. Low, average, and high scores all have potentially positive as well as potentially negative implications.',
    ],
}

# The "uses" page lists areas in circles drawn as a picture (the same in every version); copied, in reading order.
USES = ['Selection and Recruitment', 'Academic Counselling and Performance', 'Career Counselling and Development',
        'Communication skills', 'Teamwork', 'Life Coaching', 'Benchmarking', 'Decision Making', 'Self Development',
        'Relationship Counselling', 'Work Engagement and Productivity', 'Mental Health and Resilience',
        'Performance Appraisals', 'Leadership and Management', 'Subconscious Reprogramming']

# Known oddities in the samples, kept word for word and listed for LPL to check.
FLAGS = {
    'leadership': {
        'emotion_regulation': 'The sample\'s Emotion Regulation page carries a definition of Emotion Management ("Where Emotion regulation is concerned with managing your own feelings, the facet Emotion management is concerned with..."). Copied as printed; LPL to supply the right text.',
        'emotion_management': 'The sample has no space in "feelings.How effective". Copied as printed.',
    },
}


def build_version(vid, spec):
    layer, cards = ref(f'{vid}-text-layer.json')['pages'], ref(f'{vid}-cards-ocr.json')['pages']
    sample = data(spec['sample'])
    used = set()

    def blocks(page):
        return [b for b in layer[page - 1]['blocks'] if not (b['text'] == 'Page' or b['text'].isdigit() or b['text'].startswith('©'))]

    def titled(page):
        """A page's text as sections: each title (Medium 19.8) with the paragraphs under it."""
        out = []
        for b in blocks(page):
            if 'Medium' in b['font'] and b['size'] > 15:
                out.append({'title': b['text'], 'paragraphs': []})
            elif out:
                out[-1]['paragraphs'].append(b['text'])
        return out

    def card_paras(page):
        raw = '\n\n'.join(x for c in cards.get(str(page), []) for x in c)
        for pg, wrong, right in FIXES[vid]:
            if pg == page:
                assert wrong in raw, (vid, page, wrong)
                raw = raw.replace(wrong, right)
                used.add((pg, wrong))
        for a, b in GENERIC:
            raw = re.sub(a, b, raw)
        return [typo(p) for p in raw.split('\n\n')]

    v = dict((k, spec[k]) for k in ('name', 'cover', 'header', 'cover_image'))   # cover_image: assets/covers/ (the design-system cover without its name and copyright)
    v['source'] = spec['pdf']
    pages = v['pages'] = {}
    p3 = titled(3)[0]
    pages['intro'] = {'title': p3['title'], 'paragraphs': p3['paragraphs']}
    p4 = titled(4)
    pages['structure'] = {'title': p4[0]['title'], 'paragraph': p4[0]['paragraphs'][0], 'diagram_top': 'Trait Emotional Intelligence',
                          'scores_title': p4[1]['title'], 'scores': SCORES_OPENING[vid] + card_paras(4)[1:]}
    p5 = titled(5)
    if len(p5) > 1:   # Corporate: "Factor and Facets" above the uses
        pages['factors'] = {'title': p5[0]['title'], 'paragraphs': p5[0]['paragraphs']}
    pages['uses'] = {'title': p5[-1]['title'], 'paragraph': ' '.join(p5[-1]['paragraphs']), 'items': USES}
    quote = [b['text'] for b in blocks(6) if 'Medium' in b['font'] and b['size'] > 9]
    pages['wheel'] = {'title': 'Your TEIQue Wheel Chart', 'quote': quote[0], 'quote_by': quote[1],
                      'title_source': 'Figma (the sample page has no title); contents entry: Wheel Chart'}
    pages['summary'] = {'title': 'Your TEIQue Summary Graph', 'title_source': 'Figma (the sample page has no title); contents entry: Summary Graphs'}
    pages['contents'] = {'title': 'Contents', 'intro': 'Introduction', 'wheel': 'Wheel Chart', 'summary': 'Summary Graphs',
                         'global': 'Global Score', 'independent': 'Independent Facets'}
    pages['scale'] = {'your_score': 'Your Score', 'source': 'Figma global and factor pages (the sample has no heading above the card)'}

    scales = v['scales'] = {}
    for page, sid in PAGES.items():
        bl = blocks(page)
        title = bl[0]['text']
        lead = ' '.join(b['text'] for b in bl[1:] if 'Medium' in b['font'])
        definition = '\n\n'.join(b['text'] for b in bl[1:] if 'Light' in b['font'])
        score = sample['self'][sid]
        interp = {'low': '', 'average': '', 'high': ''}
        interp[band(score)] = '\n\n'.join(card_paras(page))
        scales[sid] = {'title': title, 'lead': lead, 'definition': definition, 'interpretation': interp,
                       'source': f'sample page {page}; interpretation for a score of {score} ({band(score)} band)'}
        if FLAGS.get(vid, {}).get(sid):
            scales[sid]['flag'] = FLAGS[vid][sid]
    unused = [f for f in FIXES[vid] if (f[0], f[1]) not in used]
    assert not unused, unused
    return v


lib = {
    'schema': 'teique-ff-text/2',
    'language': 'en',
    'source': 'TEIQue-FF sample reports (2025), word for word, one version per sample. Built by tools/build-library.py.',
    'footer': {'copyright': '© K. V. Petrides {year}. All rights reserved.', 'legal': 'A product of London Psychometric Laboratory Ltd.'},
    'card_headings': CARD_HEADINGS,
    # where the live text goes on each cover (assets/covers/layout.json, made by tools/clean-covers.py)
    'covers': json.load(open(os.path.join(ROOT, 'assets', 'covers', 'layout.json'), encoding='utf-8')),
    'versions': {vid: build_version(vid, spec) for vid, spec in VERSIONS.items()},
}

out = os.path.join(ROOT, 'text/library.json')
json.dump(lib, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
open(os.path.join(ROOT, 'text/library.js'), 'w', encoding='utf-8').write(
    '// Generated by tools/build-library.py from text/library.json. Do not edit.\nwindow.TEIQ_FF_TEXT = ' + json.dumps(lib, ensure_ascii=False, indent=2) + ';\n')
for vid, v in lib['versions'].items():
    have = sum(1 for s in v['scales'].values() for t in s['interpretation'].values() if t)
    print(f'{vid}: {len(v["scales"])} scales, {have} of {3 * len(v["scales"])} interpretation texts')

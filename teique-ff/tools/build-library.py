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
    t = re.sub(r"(\w)([sS])'(?=[\s.,;:])", r'\1\2’', t)     # others' -> others’
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


# ---------------------------------------------------------------- Recruitment: its own template
# One page per factor with all its facets, seven score levels, and short cards: an opening sentence ("The
# Happiness score is low."), then possible advantages and disadvantages (facets) or observations (factors).
# The cards were transcribed from the sample's pictures (reference/recruitment-cards.json).
LEVELS = [  # the introduction: "1-15% very low, 16-30% low, 31-40% low-average, 41-60% average, 61-70% high-average, 71-85% high, 86-99% very high"
    {'id': 'very_low', 'label': 'very low', 'min': 1, 'max': 15}, {'id': 'low', 'label': 'low', 'min': 16, 'max': 30},
    {'id': 'low_average', 'label': 'low average', 'min': 31, 'max': 40}, {'id': 'average', 'label': 'average', 'min': 41, 'max': 60},
    {'id': 'high_average', 'label': 'high average', 'min': 61, 'max': 70}, {'id': 'high', 'label': 'high', 'min': 71, 'max': 85},
    {'id': 'very_high', 'label': 'very high', 'min': 86, 'max': 99}]
# the scale names as the cards' opening sentences write them ("The Well-being score is low.")
CARD_NAMES = {'global': 'Global trait EI', 'wellbeing': 'Well-being', 'happiness': 'Happiness', 'optimism': 'Optimism', 'self_esteem': 'Self-esteem',
              'self_control': 'Self-control', 'emotion_regulation': 'Emotion regulation', 'impulse_control': 'Impulse control',
              'stress_management': 'Stress management', 'emotionality': 'Emotionality', 'empathy': 'Empathy', 'emotion_perception': 'Emotion perception',
              'emotion_expression': 'Emotion expression', 'relationships': 'Relationships', 'sociability': 'Sociability',
              'emotion_management': 'Emotion management', 'assertiveness': 'Assertiveness', 'social_awareness': 'Social awareness',
              'adaptability': 'Adaptability', 'self_motivation': 'Self-motivation'}
OPENING = 'The {name} score is {level}.'
# Average scores (31-70%): "For reasons of space ... these descriptions have not been included in the Recruitment report" (its
# introduction). The sample's average cards carry this sentence instead, with the scale's name (Assertiveness card, page 9).
AVERAGE_TEXT = 'Average scores are less likely to exert marked influence on behavior compared to high and low scores. In general, average scores on {name} will involve some combination of the characteristics of high and low scores – see the introduction on p. XX for details.'


def build_recruitment():
    layer = ref('recruitment-text-layer.json')['pages']
    cards = ref('recruitment-cards.json')['cards']
    blocks = lambda page: [b for b in layer[page - 1]['blocks'] if not (b['text'] == 'Page' or b['text'].isdigit() or b['text'].startswith('©'))]
    level_of = lambda s: next(l for l in LEVELS if l['min'] <= s <= l['max'])
    v = {'name': 'Recruitment', 'cover': 'Recruitment Report', 'header': 'Recruitment', 'cover_image': 'recruitment.png', 'template': 'recruitment',
         'source': 'TEIQue-FF Recruitment Report [SAMPLE].pdf', 'levels': LEVELS, 'opening': OPENING, 'average_text': AVERAGE_TEXT,
         'average_source': 'Recruitment introduction (page 3) and the sample\'s average cards (Assertiveness, page 9)'}
    p3 = blocks(3)
    sign = [b['text'] for b in p3 if b['text'] in ('Sincerely,', 'Konstantinos V. Petrides', 'psychometriclab.com')]
    pages = v['pages'] = {
        'intro': {'title': p3[0]['text'], 'paragraphs': [b['text'] for b in p3[1:] if b['text'] not in sign], 'signoff': sign},
        'summary': {'title': 'Your TEIQue Summary Graph', 'title_source': 'Figma (the sample page has no title); contents entry: Summary Graphs'},
        # the contents page is a picture: its entries, copied
        'contents': {'title': 'Contents', 'intro': 'Introduction', 'summary': 'Summary Graphs', 'global': 'Global Score', 'auxiliary': 'Auxiliary facets',
                     'subs': {'auxiliary': ['Adaptability', 'Self-motivation'], 'wellbeing': ['Happiness', 'Optimism', 'Self-Esteem'],
                              'self_control': ['Emotion Regulation', 'Impulse Control', 'Stress Management'],
                              'emotionality': ['Empathy', 'Emotion Perception', 'Emotion Expression', 'Relationships'],
                              'sociability': ['Emotion Management', 'Assertiveness', 'Social Awareness']},
                     'factors': {'wellbeing': 'Well-Being', 'self_control': 'Self-Control', 'emotionality': 'Emotionality', 'sociability': 'Sociability'}},
    }
    p5 = blocks(5)
    pages['global'] = {'title': p5[0]['text'], 'lead': p5[1]['text']}
    pages['auxiliary'] = {'title': p5[2]['text'], 'facets': ['adaptability', 'self_motivation'], 'headings': [p5[3]['text'], p5[4]['text']]}
    # factor pages 6-9: title, lead, then the facets in the order the page prints them, with their headings
    ORDER = {6: ('wellbeing', ['happiness', 'optimism', 'self_esteem']), 7: ('self_control', ['emotion_regulation', 'impulse_control', 'stress_management']),
             8: ('emotionality', ['emotion_perception', 'emotion_expression', 'empathy', 'relationships']),
             9: ('sociability', ['assertiveness', 'emotion_management', 'social_awareness'])}
    pages['factors'] = []
    headings = {'adaptability': p5[3]['text'], 'self_motivation': p5[4]['text']}
    for page, (fid, facets) in ORDER.items():
        bl = blocks(page)
        pages['factors'].append({'id': fid, 'title': bl[0]['text'], 'lead': bl[1]['text'], 'facets': facets})
        for f, b in zip(facets, [b for b in bl if b['font'].endswith('Bold')]):
            headings[f] = b['text']
    sample = data('sample-ff-recruitment.json')['self']
    scales = v['scales'] = {}
    for sid, name in CARD_NAMES.items():
        c = cards[sid]
        assert c['score'] == sample[sid], (sid, c['score'], sample[sid])
        lv = level_of(c['score'])
        # the opening sentence comes from the pattern; check it reproduces the sample's
        assert c['paragraphs'][0] == OPENING.format(name=name, level=lv['label']), (sid, c['paragraphs'][0])
        body = c['paragraphs'][1:]
        interp = {l['id']: [] for l in LEVELS}
        if lv['id'] in ('low_average', 'average', 'high_average') and body == [AVERAGE_TEXT.format(name=name)]:
            body = []          # the standard average sentence: the report adds it for every average score
        interp[lv['id']] = body
        scales[sid] = {'card_name': name, 'heading': headings.get(sid, ''), 'interpretation': interp,
                       'source': f'sample page {c["page"]}; card for a score of {c["score"]} ({lv["label"]})'}
    scales['optimism']['flag'] = ('The sample\'s Optimism card (average) prints a broken form of the average sentence: "average scores on XXX will '
                                  'involve some combination of the characteristics of high and low scores Optimism facet – see the introduction on p. XX for '
                                  'details". Kept as printed for the average level; other average scores use the Assertiveness form.')
    for sid in CARD_NAMES:
        scales[sid].setdefault('flag', '')
    scales['assertiveness']['flag'] = 'Average sentence: "see the introduction on p. XX" is a placeholder in the sample (the introduction is page 3). Kept as printed.'
    return v


# ---------------------------------------------------------------- Developmental: its own template
# The Developmental report covers the advantages' flip side: for each factor, a paragraph beside the score wheel and
# a card of pointers; for each facet, headed sections ("INAPPROPRIATE CONTEXT"), each a short observation and advice.
# Facet cards: OCR of the card pictures (reference/developmental-cards-ocr.json), proofread against them (FIXES_DEV).
# Factor pages: transcribed from the pictures by eye (DEV_FACTORS); OCR cannot read their narrow cards and bullets.
DEV_FACTORS = {
    'wellbeing': {'intro': 'The Well-being factor of the TEIQue comprises the facets of Happiness, Optimism, and Self-esteem. You have scored within the high range, which means that you are more satisfied with yourself in this area than most people. As with all TEIQue scores, this one is linked to potential advantages as well as potential disadvantages. The pointers listed below focus on the latter. They may be helpful for managing high scores on TEIQue Well-being.',
                  'bullets': ['Be careful not to express positive feelings insensitively or in inappropriate contexts.',
                              'A strong focus on positive emotions can make you less attentive to the external environment or lead to the development of unrealistic expectations. Be especially weary if your high Well-being is the result of favorable external circumstances.',
                              'While you should be aware of your strengths, it is also important to remain cognizant of the areas where you need improvement. Alas, many of those may lie outside of conscious awareness.',
                              'Learn to distinguish between confidence and over-confidence as well as to identify and evaluate the true sources of your confidence.',
                              'Beware of any tendencies towards self-absorption and narcissism. Cultivate humility as a path to freedom from a need for praise or admiration.',
                              'Whenever possible, ask others to provide feedback on your ideas and performance and be prepared to act on such feedback.']},
    'self_control': {'intro': 'The Self-control factor of the TEIQue comprises the facets of Emotion regulation, Impulse control, and Stress management. You have scored within the high range, which means that you are more satisfied with yourself in this area than most people. As with all TEIQue scores, this one is linked to potential advantages as well as potential disadvantages. The pointers listed below focus on the latter. They may be helpful for managing high scores on TEIQue Self-control.',
                     'bullets': ['Feelings are transient and neither bad nor good, so they should not be suppressed. Both ‘negative’ and ‘positive’ feelings provide clues about situations.',
                                 'Excessive emotional control may lead others to perceive you as aloof and cold. Learn to express sensitivity and empathy to others, which may require you to enlarge your emotional vocabulary.',
                                 'Excessive impulse control can deprive you of positive experiences, stifle your spontaneity, and allow rigidity to set in.',
                                 'Hunches and impulses, when authentic, can improve decision-making and facilitate action when time or information is in short supply.',
                                 'Moderate stress levels have been shown to facilitate good performance (so-called “Eustress”).',
                                 'Avoid judging those who lack your self-control skills.']},
    'emotionality': {'intro': 'The Emotionality factor of the TEIQue comprises the facets of Emotion perception, Emotion expression, Empathy, and Relationships. You have scored within the high range, which means that you are more satisfied with yourself in this area than most people. As with all TEIQue scores, this one is linked to potential advantages as well as potential disadvantages. The pointers listed below focus on the latter. They may be helpful for managing high scores on TEIQue Emotionality.',
                     'bullets': ['Do not get caught into a world of feelings and moods, but rather understand it as a significant layer and move deeper into the human psyche.',
                                 'Avoid reaching conclusions about other people’s feelings without corroborating evidence.',
                                 'Carefully consider the context before expressing your emotions. Certain contexts call for highly specific channels of expression and others for none (e.g., state or business negotiations).',
                                 'Be mindful that personal relationships may interfere with your duties (personal or professional) and that you may unwittingly become dependent on them.']},
    'sociability': {'intro': 'The Sociability factor of the TEIQue comprises the facets of Assertiveness, Emotion management, and Social awareness. You have scored within the high range, which means that you are more satisfied with yourself in this area than most people. As with all TEIQue scores, this one is linked to potential advantages as well as potential disadvantages. The pointers listed below focus on the latter. They may be helpful for managing high scores on TEIQue Sociability.',
                    'bullets': ['If assertiveness is an important aspect of how you relate to other people, you must be very careful that it does not veer into aggression or whimsical behavior. Note that getting what you want by recklessly coercing or exploiting others can create, sustain, or enhance crises in the subconscious mind. Overassertiveness needs to be pointed out by others – it cannot be detected through personal efforts.',
                                'A talent for Sociability, when effectively applied, can eventually make other people dependent on you. This would entail difficulties and threats both for you and for them.',
                                'Avoid using Sociability to invade other people’s privacy or manipulate them. It is important for you to be fully clear about your intentions prior to putting such talents and skills to use.',
                                'Be careful that your socializing is not happening at the expense of your duties and responsibilities. Make sure you allow adequate time for solitary reflection.',
                                'High Sociability could alienate introverts from you and you from them. You should overcome any tendencies to associate exclusively with the extraverted.']},
}
FIXES_DEV = [
    (7, 'environment -teamwork- as', 'environment –teamwork– as'),
    (8, 'NEGATIVE EMOTIONS OR [?]', 'NEGATIVE EMOTIONS OR SITUATIONS'),
    (9, 'SwoT', 'SWOT'),
    (9, 'aspects of alebau, palleo-os aut ssarddns tou llm nok teut smous so!lentis', 'aspects of situations shows that you will not suppress the so-called "negative".'),
    (10, 'criticism of [?]', 'criticism of others.'),
    (10, 'occur-regardless', 'occur—regardless'),
    (10, 'into lacel compl enc', 'into complacency.'),
    (12, 'react sive efe ens', 'react defensively.'),
    (14, 'management-rather than repression-is', 'management—rather than repression—is'),
    (14, 'express true your fe', 'express your true feelings.'),
    (14, 'appreciate in bur', 'appreciate your sincerity.'),
    (17, 'keeping journa al', 'keeping a journal.'),
    (20, 'context an im', 'context and time.'),
    (21, 'feelings - an over-focus', 'feelings — an over-focus'),
    (21, 'achieve bei ette an', 'achieve better balance.'),
    (21, 'feelings-even when', 'feelings—even when'),
    (21, 'accurately-are', 'accurately—are'),
    (22, 'are new [?] [?]', 'are new to you.'),
    (22, 'others-particularly those more reserved-feel', 'others—particularly those more reserved—feel'),
    (22, 'self- orp', 'self-absorption.'),
    (23, 'your personal [?]', 'your personal expression.'),
    (23, 'when-and to whomyou', 'when—and to whom—you'),
    (24, 'network-you', 'network—you'),
    (27, 'perspective - perhaps', 'perspective — perhaps'),
    (27, 'management - are you', 'management – are you'),
    (29, '\n\n[?]\n\n', '\n\nDEPENDENCE\n\n'),
    (29, 'ther you ay fe en distressed', 'then you may feel distressed'),
    (31, 'society" If', 'society." If'),
    (31, 'OR [?]', 'OR INSINCERITY'),
    (32, 'unaware of - acknowledging', 'unaware of – acknowledging'),
    (32, 'open-mindedness on bur', 'open-mindedness on your part.'),
    (33, 'contain your own ad', 'contain your own workload.'),
    (33, "suggestions.\n\nSelf-motivation can over-commit", "suggestions.\n\nNEGLECT OF LIFE DOMAINS (MONO-DIMENSIONALITY)\n\nSelf-motivation can over-commit"),
    (34, 'your pel orm an', 'your performance.'),
]
# which cards of which pages hold each facet's sections: (page, card index); the header strip is card 0
DEV_CARDS = {
    'happiness': [(7, 1), (8, 1)], 'optimism': [(9, 1), (10, 1)], 'self_esteem': [(11, 1), (12, 1)],
    'emotion_regulation': [(14, 1), (15, 1)], 'impulse_control': [(15, 2), (16, 1), (17, 1)], 'stress_management': [(17, 2), (18, 1)],
    'empathy': [(20, 1)], 'emotion_perception': [(21, 1)], 'emotion_expression': [(22, 1), (23, 1)], 'relationships': [(24, 1), (25, 1)],
    'emotion_management': [(27, 1)], 'assertiveness': [(28, 1)], 'social_awareness': [(29, 1), (30, 1)],
    'adaptability': [(31, 1), (32, 1)], 'self_motivation': [(33, 1), (34, 1)],
}
DEV_FLAGS = {
    'social_awareness': 'The sample says "it should be allowed to overshadow other areas of life" (PRIORITIZATION ISSUES), probably meant "should not". Copied as printed.',
    'self_motivation': 'The sample says "is not always easy recognize" (NEGLECT OF LIFE DOMAINS). Copied as printed.',
    'wellbeing': 'The sample says "Be especially weary" (for "wary"). Copied as printed.',
    'impulse_control': 'The average-range opening calls the facet "Impulsiveness". Copied as printed.',
}
is_heading = lambda t: bool(re.fullmatch(r"[A-Z0-9 &’'()\-–,]+", t)) and any(ch.isalpha() for ch in t)


def build_developmental():
    layer = ref('developmental-text-layer.json')['pages']
    cards = ref('developmental-cards-ocr.json')['pages']
    sample = data('sample-ff-developmental.json')['self']
    used = set()
    blocks = lambda page: [b for b in layer[page - 1]['blocks'] if not (b['text'] == 'Page' or b['text'].isdigit() or b['text'].startswith('©'))]

    def page_cards(page):
        """The page's cards as text, corrected: a list of cards, each a list of paragraphs."""
        raw = '\n\n\n'.join('\n\n'.join(card) for card in cards[str(page)])
        for pg, wrong, right in FIXES_DEV:
            if pg == page:
                assert wrong in raw, (page, wrong)
                raw = raw.replace(wrong, right); used.add((pg, wrong))
        for a, b in GENERIC:
            raw = re.sub(a, b, raw)
        return [[typo(x) for x in c.split('\n\n')] for c in raw.split('\n\n\n')]

    v = {'name': 'Developmental', 'cover': 'Developmental Report', 'header': 'Developmental', 'cover_image': 'developmental.png',
         'template': 'developmental', 'source': 'TEIQue-FF Developmental Report [SAMPLE].pdf'}
    p3 = blocks(3)
    sign = [b['text'] for b in p3[1:] if len(b['text']) < 60]
    quote = [b['text'] for b in blocks(4) if 'Medium' in b['font']]
    v['pages'] = {
        'intro': {'title': p3[0]['text'], 'paragraphs': [b['text'] for b in p3[1:] if b['text'] not in sign], 'signoff': sign},
        'wheel': {'title': 'Your TEIQue Wheel Chart', 'quote': quote[0], 'quote_by': quote[1], 'title_source': 'Figma (the sample page has no title); contents entry: Wheel Chart'},
        'summary': {'title': 'Your TEIQue Summary Graph', 'title_source': 'Figma (the sample page has no title); contents entry: Summary Graphs'},
        'contents': {'title': 'Contents', 'intro': 'Introduction', 'wheel': 'Wheel Chart', 'summary': 'Summary Graphs', 'independent': 'Independent Facets'},
    }
    scales = v['scales'] = {}
    titles = {6: 'wellbeing', 13: 'self_control', 19: 'emotionality', 26: 'sociability'}
    for sid, f in DEV_FACTORS.items():
        b = band(sample[sid]); interp = {'low': None, 'average': None, 'high': None}; interp[b] = f
        scales[sid] = {'title': {'wellbeing': 'Well-Being Factor', 'self_control': 'Self-Control Factor', 'emotionality': 'Emotionality Factor', 'sociability': 'Sociability Factor'}[sid],
                       'title_source': 'Figma Developmental factor frame (the sample prints the factor name in capitals: ' + blocks([k for k, x in titles.items() if x == sid][0])[0]['text'] + ')',
                       'interpretation': interp, 'source': f'sample page {[k for k, x in titles.items() if x == sid][0]}, transcribed; score {sample[sid]} ({b} band)'}
    facet_titles = {}
    for page in range(7, 35):
        for bl in blocks(page):
            facet_titles.setdefault(bl['text'], page)
    for sid, where in DEV_CARDS.items():
        paras = []
        for page, idx in where:
            paras += page_cards(page)[idx]
        intro, sections = '', []
        for x in paras:
            if is_heading(x):
                sections.append({'heading': x, 'paragraphs': []})
            elif sections:
                sections[-1]['paragraphs'].append(x)
            else:
                intro = (intro + '\n\n' + x).strip()
        assert all(s_['paragraphs'] for s_ in sections), sid
        b = band(sample[sid]); interp = {'low': None, 'average': None, 'high': None}; interp[b] = {'intro': intro, 'sections': sections}
        title = next(t for t in facet_titles if t.lower() == T_NAMES[sid].lower())
        scales[sid] = {'title': title, 'interpretation': interp, 'source': f'sample pages {sorted({p for p, _ in where})}; score {sample[sid]} ({b} band)'}
    for sid, msg in DEV_FLAGS.items():
        scales[sid]['flag'] = msg
    unused = [f for f in FIXES_DEV if (f[0], f[1]) not in used]
    assert not unused, unused
    return v


T_NAMES = {'happiness': 'Happiness', 'optimism': 'Optimism', 'self_esteem': 'Self-Esteem', 'emotion_regulation': 'Emotion Regulation',
           'impulse_control': 'Impulse Control', 'stress_management': 'Stress Management', 'empathy': 'Empathy', 'emotion_perception': 'Emotion Perception',
           'emotion_expression': 'Emotion Expression', 'relationships': 'Relationships', 'emotion_management': 'Emotion Management',
           'assertiveness': 'Assertiveness', 'social_awareness': 'Social Awareness', 'adaptability': 'Adaptability', 'self_motivation': 'Self-Motivation'}


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
lib['versions']['developmental'] = build_developmental()
lib['versions']['recruitment'] = build_recruitment()

out = os.path.join(ROOT, 'text/library.json')
json.dump(lib, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
open(os.path.join(ROOT, 'text/library.js'), 'w', encoding='utf-8').write(
    '// Generated by tools/build-library.py from text/library.json. Do not edit.\nwindow.TEIQ_FF_TEXT = ' + json.dumps(lib, ensure_ascii=False, indent=2) + ';\n')
for vid, v in lib['versions'].items():
    have = sum(1 for s in v['scales'].values() for t in s['interpretation'].values() if t)
    n = len(v['scales']) * len(next(iter(v['scales'].values()))['interpretation'])
    print(f'{vid}: {len(v["scales"])} scales, {have} of {n} interpretation texts')

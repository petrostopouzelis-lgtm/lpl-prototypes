# Builds viewer.html: viewer.src.html with the engine (src/*.js) pasted in,
# so the page is one self-contained file that can be shared or published.
#   python report-covers/viewer/build.py
from pathlib import Path

here = Path(__file__).parent
engine = '\n'.join((here.parent / 'src' / f).read_text(encoding='utf-8') for f in ['theories.js', 'cover.js', 'radial.js', 'samples.js'])
page = (here / 'viewer.src.html').read_text(encoding='utf-8').replace('/*__ENGINE__*/', engine)
(here / 'viewer.html').write_text(page, encoding='utf-8')
print('wrote', here / 'viewer.html')

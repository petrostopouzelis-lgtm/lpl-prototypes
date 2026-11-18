"""Makes a working copy of an archived account prototype.

    python "user platforms/restore-account.py" "coach account"

Copies  user platforms/cursor archive/<account>/  to  user platforms/<account>/  and makes it run on its
own: the archived pages point at folders that were never uploaded (../../005_PLATFORM ICONS,
../../006_RASTER, ../shared). Each of those files is replaced by its counterpart from the design
system's asset library (design-system/assets), copied into <account>/assets/ under a plain name, and
every reference in the pages, scripts and stylesheet is rewritten to it. The archive is not changed.

Files with no counterpart are listed at the end and their references are left as they were.
Run it again to start the working copy over from the archive (it deletes the working copy first,
except a hand-made assets/illustrations folder, which it keeps).
"""
import os, re, shutil, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
DS = os.path.join(REPO, 'design-system', 'assets')

# archived path (after '../../' or '../') -> (design-system asset, path inside <account>/assets/)
P = '005_PLATFORM ICONS/'
R = '006_RASTER/'
NOTIF = {'QUA': 'quality', 'USR': 'user', 'REM': 'reminder', 'BIL': 'billing', 'CCH': 'coaching',
         'SYS': 'system', 'SUP': 'support', 'PRO': 'product', 'INT': 'internal', 'LEG': 'legal'}
MAP = {
    P + 'other icons/X icon.svg': ('icons/x-icon.svg', 'icons/close.svg'),
    P + 'other icons/search icon.svg': ('icons/search.svg', 'icons/search.svg'),
    P + 'other icons/dropdown arrow.svg': ('icons/ui/dropdown-arrow.svg', 'icons/dropdown-arrow.svg'),
    P + 'other icons/request demo button arrow icon.svg': ('icons/ui/request-demo-arrow.svg', 'icons/arrow.svg'),
    P + 'file icons/pdf state=available.svg': ('icons/pdf-default.svg', 'icons/pdf.svg'),
    P + 'file icons/excel state=Default-1.svg': ('icons/excel-default.svg', 'icons/excel.svg'),
    P + 'file icons/csv state=Default.svg': ('icons/csv-default.svg', 'icons/csv.svg'),
    R + 'logos webp/psychometric laboratory logo_blue monogram.webp': ('logos/lpl-logo-blue-monogram.webp', 'logos/lpl-monogram.webp'),
    R + 'report covers/personal cover 2023-01.png': ('report-covers/personal.png', 'report-covers/personal.png'),
    R + 'report covers/corporate cover 2023-01.png': ('report-covers/corporate.png', 'report-covers/corporate.png'),
    R + 'report covers/leadership cover 2023-01.png': ('report-covers/leadership.png', 'report-covers/leadership.png'),
    R + 'report covers/developmental cover-01.png': ('report-covers/developmental.png', 'report-covers/developmental.png'),
    R + 'report covers/recruitment cover 2023-01.png': ('report-covers/recruitment.png', 'report-covers/recruitment.png'),
}
for k, v in NOTIF.items():
    MAP[P + f'notification icons/notification ID={k}.svg'] = (f'icons/notifications/{v}.svg', f'icons/notifications/{v}.svg')
# report covers named in report-covers.js (FILES map), file name -> asset
COVERS = {
    'personal cover 2023-01.png': 'personal.png', 'corporate cover 2023-01.png': 'corporate.png',
    'leadership cover 2023-01.png': 'leadership.png', 'developmental cover-01.png': 'developmental.png',
    'recruitment cover 2023-01.png': 'recruitment.png', 'Teams Cover 2023-01.png': 'teams.png',
    'compatibility report cover 3-01.png': 'compatibility.png', 'Team Grouping Cover 2023 blank-01.png': 'team-grouping.png',
    'RoleSync  Cover full.png': 'rolesync.png', 'Scan-In Cover 2023 3-01.png': 'scan-in.png', '3RS sample cover.png': '3rs-sample.png',
}
# no counterpart in the design system: drawn stand-ins kept in assets/illustrations/ (made by hand, not by this script)
STANDINS = {
    R + 'platform illustrations/png/blue gift.png': 'illustrations/gift.svg',
    R + 'platform illustrations/png/white basket.png': 'illustrations/basket.svg',
}


def main(account):
    src = os.path.join(HERE, 'cursor archive', account)
    dst = os.path.join(HERE, account)
    if not os.path.isdir(src):
        sys.exit(f'No archived account at {src}')
    keep = os.path.join(dst, 'assets', 'illustrations')
    saved = None
    if os.path.isdir(keep):
        saved = os.path.join(HERE, '.illustrations-keep')
        shutil.rmtree(saved, ignore_errors=True)
        shutil.copytree(keep, saved)
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns('mockups and references'))
    if saved:
        shutil.copytree(saved, keep)
        shutil.rmtree(saved)

    used, unknown = set(), set()

    def fix(text):
        def repl(m):
            prefix, path = m.group(1), m.group(2)
            if path.endswith('/'):
                return m.group(0)      # a folder (report-covers.js), rewritten below
            if path in MAP:
                used.add(path)
                return 'assets/' + MAP[path][1]
            if path in STANDINS:
                used.add(path)
                return 'assets/' + STANDINS[path]
            unknown.add(prefix + path)
            return m.group(0)
        return re.sub(r"(\.\./\.\./)((?:005_PLATFORM ICONS|006_RASTER)/[^\"')]+)", repl, text)

    for name in os.listdir(dst):
        f = os.path.join(dst, name)
        if not name.endswith(('.html', '.js', '.css')):
            continue
        text = open(f, encoding='utf-8').read()
        out = fix(text)
        # app.js builds two paths from ICON_BASE
        out = out.replace("const ICON_BASE = '../../005_PLATFORM ICONS/';", "const ICON_BASE = 'assets/icons/';")
        out = out.replace("ICON_BASE + 'other icons/search icon.svg", "ICON_BASE + 'search.svg")
        out = out.replace("ICON_BASE + 'other icons/dropdown arrow.svg", "ICON_BASE + 'dropdown-arrow.svg")
        if "ICON_BASE + 'search.svg" in out:
            used.update([P + 'other icons/search icon.svg', P + 'other icons/dropdown arrow.svg'])
        # report-covers.js: one folder, plain file names
        if name == 'report-covers.js':
            out = out.replace("var BASE = '../../006_RASTER/report covers/';", "var BASE = 'assets/report-covers/';")
            for old, new in COVERS.items():
                out = out.replace(f"'{old}'", f"'{new}'")
            for new in COVERS.values():
                shutil.copy(os.path.join(DS, 'report-covers', new), ensure(dst, 'report-covers/' + new))
        # shared scripts were not uploaded: look for them next to the pages
        out = out.replace('src="../shared/', 'src="shared/')
        if out != text:
            open(f, 'w', encoding='utf-8').write(out)

    for path in used:
        if path in MAP:
            shutil.copy(os.path.join(DS, MAP[path][0]), ensure(dst, MAP[path][1]))

    missing_standins = [v for k, v in STANDINS.items() if k in used and not os.path.exists(os.path.join(dst, 'assets', v))]
    shared = sorted({m for n in os.listdir(dst) if n.endswith('.html')
                     for m in re.findall(r'src="shared/([^"]+)"', open(os.path.join(dst, n), encoding='utf-8').read())
                     if not os.path.exists(os.path.join(dst, 'shared', m))})
    print(f'{account}: {len(used)} archived files mapped to assets/')
    for u in sorted(unknown):
        print('  no counterpart, left as is:', u)
    for s in missing_standins:
        print('  stand-in to draw by hand:', 'assets/' + s)
    for s in shared:
        print('  shared script not uploaded:', 'shared/' + s)


def ensure(dst, rel):
    p = os.path.join(dst, 'assets', rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'coach account')

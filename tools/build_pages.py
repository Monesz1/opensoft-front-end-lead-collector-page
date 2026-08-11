# -*- coding: utf-8 -*-
"""Build the four document pages from content/<lang>/<slug>.md.

Produces, for every language:
    pages/<lang>/<slug>.html   a fragment: <h1> + <div class="prose">

and, at the repository root, the four full pages with the DEFAULT language baked in, so the
content is present for crawlers and for visitors without JavaScript. assets/i18n.js swaps the
fragment when another language is selected.

Everything written for the editor rather than the reader is stripped: YAML front matter, HTML
comments, "Editor note" callouts, placeholder registers, the implementation-spec section and
image-slot lines. Every removal is counted so it can be checked rather than trusted.

Run from anywhere:   python3 tools/build_pages.py
"""
import re, pathlib, html as _html, unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'content'
PAGES = ROOT / 'pages'
LOGO = ROOT / 'assets' / 'opensoft-logo.svg'

DEFAULT_LANG = 'hu'
LANGS = ['hu', 'en', 'de', 'sk', 'ro', 'hr', 'cs', 'pl', 'fr', 'it']
DOCS = ['about', 'contact', 'gdpr', 'privacy']

_src = LOGO.read_text(encoding='utf-8')
INNER = re.search(r'<title>.*?</title>\s*(.*)</svg>', _src, re.S).group(1).strip()
INNER = '\n'.join('          ' + l.strip() for l in INNER.split('\n'))

NAV = [('about', 'about.html', 'footer_link_about', None),
       ('contact', 'contact.html', 'footer_link_contact', None),
       ('gdpr', 'gdpr.html', None, 'GDPR'),
       ('privacy', 'privacy.html', 'footer_link_privacy', None)]

# Editor-only callouts and register headings are translated into all ten languages. Rather than list
# every accented/apostrophised variant (fragile), we FOLD each candidate to plain ASCII (lowercase,
# strip diacritics, punctuation -> space) and match accent-free phrases. Every phrase below is the
# folded form of a marker actually present in content/<lang>/*.md; see docs comments per family.
def _fold(s):
    s = unicodedata.normalize('NFKD', s.lower())
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


# Editor-note / verification-note / accessibility-note / "before you publish" families, all langs.
# These mark blockquotes written for the editor, never the reader. Substantive reader-facing
# callouts (the "short answer", GitHub's dual role, "does not touch GitHub", the right-to-object
# box) deliberately share NO phrase below, so they survive.
EDITOR_PHRASES = [
    'editor note', 'note to the editor', 'note for the editor', 'verification note',
    'reconciliation note', 'accessibility note', 'before you publish',
    'this question is settled', 'read before publishing',
    'megjegyzes a szerkesztonek', 'publikalas elott', 'akadalymentessegi megjegyzes',
    'ellenorzesi megjegyzes',                                                    # hu
    'redaktionshinweis', 'hinweis fur den redakteur', 'hinweis zur barrierefreiheit',
    'vor der veroffentlichung', 'prufvermerk',                                   # de
    'note a l editeur', 'note pour la redaction', 'note a la redaction',
    'note sur l accessibilite', 'note de verification', 'avant de publier',
    'avant la publication',                                                      # fr
    'nota per il redattore', 'nota sull accessibilita', 'nota di verifica',
    'prima della pubblicazione',                                                 # it
    'poznamka pre editora', 'poznamka pre redaktora', 'poznamka k pristupnosti',
    'poznamka k overeniu', 'pred publikovanim', 'pred zverejnenim',              # sk
    'poznamka pro editora', 'overovaci poznamka', 'nez zverejnite', 'pred publikaci',  # cs
    'napomena urednika', 'napomena za urednika', 'napomena o pristupacnosti',
    'napomena o provjeri', 'prije objave',                                       # hr
    'uwaga dla redaktora', 'uwaga redakcyjna', 'uwaga dotyczaca dostepnosci',
    'uwaga weryfikacyjna', 'przed publikacja',                                   # pl
    'nota pentru editor', 'nota privind accesibilitatea', 'nota de verificare',
    'inainte de publicare',                                                      # ro
]
EDITOR_RE = re.compile('|'.join(re.escape(p) for p in EDITOR_PHRASES))

# "Editable placeholders" register-section heading, all languages. Match the STABLE placeholder-noun
# stem, not the adjective: translators vary the adjective and even the noun per document
# (sk/cs "Editovateľné/Upraviteľné", "symboly/znaky"; hr "Uredljiva/Urediva"), but the noun stem is
# constant. Verified: no substantive '## ' heading in any language contains one of these stems.
REGISTER_STEMS = [
    'placeholder',            # en: editable placeholders
    'helyorz',                # hu: szerkeszthető helyőrzők
    'platzhalter',            # de: bearbeitbare Platzhalter
    'zastupn',                # sk/cs: (editovateľné/upraviteľné) zástupné symboly/znaky
    'substituent',            # ro: substituenți editabili
    'rezervirana mjesta',     # hr: uredljiva/urediva rezervirana mjesta
    'symbole zastepcze',      # pl: edytowalne symbole zastępcze
    'espaces reserv',         # fr: espaces réservés modifiables
    'segnaposto',             # it: segnaposto modificabili
    'implementation spec', 'review record', 'decisions taken',
]

# Image-slot lines are italic and cite a {{GALLERY_IMAGE_*}} token in every language, so match on
# the token (language-agnostic); keep the en/hu prefixes as a belt-and-braces fallback.
IMG_SLOT_RE = re.compile(
    r'^\s*\*[^\n]*\{\{GALLERY_IMAGE_[A-Z_]+\}\}'
    r'|^\s*\*(image placeholder|képhelyőrző)', re.I)


def is_register_heading(line):
    m = re.match(r'^#{2,}\s+(.*)', line)
    if not m:
        return False
    folded = _fold(m.group(1))
    return any(stem in folded for stem in REGISTER_STEMS)

stripped = 0


def strip_editorial(md):
    global stripped
    md = re.sub(r'\A---\n.*?\n---\n', '', md, flags=re.S)
    md = re.sub(r'<!--.*?-->', '', md, flags=re.S)
    out, i, lines = [], 0, md.split('\n')
    while i < len(lines):
        line = lines[i]
        if IMG_SLOT_RE.match(line):
            stripped += 1
            i += 1
            continue
        if is_register_heading(line):
            j = i + 1
            while j < len(lines) and not re.match(r'^##\s', lines[j]):
                j += 1
            stripped += 1
            i = j
            continue
        # consecutive '>' lines only - a blank line ends the block, so an editor note can never
        # swallow a neighbouring substantive callout
        if line.startswith('>'):
            j = i
            while j < len(lines) and lines[j].startswith('>'):
                j += 1
            if EDITOR_RE.search(_fold('\n'.join(lines[i:j]))):
                stripped += 1
                i = j
                continue
        out.append(line)
        i += 1
    return re.sub(r'\n{3,}', '\n\n', '\n'.join(out)).strip()


def inline(t):
    t = _html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\*\w])\*([^*\n]+)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
               lambda m: '<a href="%s"%s>%s</a>' % (
                   m.group(2),
                   ' target="_blank" rel="noopener noreferrer"' if m.group(2).startswith('http') else '',
                   m.group(1)), t)
    return re.sub(r'\{\{([A-Z_0-9]+)\}\}', r'<mark class="ph">\1</mark>', t)


def render(md):
    out, i, lines = [], 0, md.split('\n')
    while i < len(lines):
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        if set(s) <= {'-'} and len(s) >= 3:
            out.append('<hr>')
            i += 1
            continue
        m = re.match(r'^(#{1,4})\s+(.*)', s)
        if m:
            lvl = len(m.group(1))
            if lvl == 1:
                i += 1
                continue
            out.append('<h%d>%s</h%d>' % (lvl, inline(m.group(2)), lvl))
            i += 1
            continue
        if s.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i += 1
            if len(rows) >= 2 and set(''.join(rows[1])) <= set('-: '):
                head, body = rows[0], rows[2:]
            else:
                head, body = None, rows
            t = ['<div class="table-wrap"><table>']
            if head:
                t.append('<thead><tr>' + ''.join('<th>%s</th>' % inline(c) for c in head) + '</tr></thead>')
            t.append('<tbody>')
            for r in body:
                t.append('<tr>' + ''.join('<td>%s</td>' % inline(c) for c in r) + '</tr>')
            t.append('</tbody></table></div>')
            out.append('\n'.join(t))
            continue
        if s.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                buf.append(re.sub(r'^\s*>\s?', '', lines[i]))
                i += 1
            out.append('<blockquote class="callout">%s</blockquote>' % render('\n'.join(buf)))
            continue
        m = re.match(r'^(\d+)\.\s+(.*)', s)
        if m or re.match(r'^[-*]\s+', s):
            ordered = bool(m)
            pat = r'^\d+\.\s+(.*)' if ordered else r'^[-*]\s+(.*)'
            items, cur = [], None
            while i < len(lines):
                st = lines[i].strip()
                mm = re.match(pat, st)
                if mm:
                    if cur is not None:
                        items.append(cur)
                    cur = mm.group(1)
                elif st and lines[i].startswith(('  ', '\t')):
                    cur = (cur or '') + ' ' + st
                else:
                    break
                i += 1
            if cur is not None:
                items.append(cur)
            tag = 'ol' if ordered else 'ul'
            out.append('<%s>%s</%s>' % (tag, ''.join('<li>%s</li>' % inline(x) for x in items), tag))
            continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(
                r'^\s*(#{1,4}\s|\||>|[-*]\s|\d+\.\s|-{3,}\s*$)', lines[i]):
            buf.append(lines[i].strip())
            i += 1
        out.append('<p>%s</p>' % inline(' '.join(buf)))
    return '\n'.join(out)


def read_doc(lang, slug):
    p = CONTENT / lang / ('%s.md' % slug)
    if not p.exists():
        return None
    raw = p.read_text(encoding='utf-8')
    fm = re.search(r'\A---\n(.*?)\n---\n', raw, re.S)
    meta = dict(re.findall(r'^(\w+):\s*(.+)$', fm.group(1), re.M)) if fm else {}
    h1 = re.search(r'^#\s+(.*)$', raw, re.M)
    title = h1.group(1).strip() if h1 else slug
    desc = meta.get('meta_description', title).strip().strip('"')
    return title, desc, render(strip_editorial(raw))


def fragment(title, desc, body):
    return ('<h1 class="page-title" data-desc="%s">%s</h1>\n<div class="prose">\n%s\n</div>\n'
            % (_html.escape(desc[:300], quote=True), _html.escape(title), body))


def footer_links(slug):
    rows = []
    for s, href, key, literal in NAV:
        cur = ' aria-current="page"' if s == slug else ''
        label = ' data-i18n="%s"' % key if key else ''
        rows.append('          <li><a href="%s"%s%s>%s</a></li>' % (href, cur, label, literal or ''))
    return '\n'.join(rows)


TPL = '''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | OpenSoft</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0F172A">
<meta property="og:type" content="article">
<meta property="og:title" content="{title} | OpenSoft">
<link rel="icon" href="assets/opensoft-icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/style.css?v=5">
<link rel="stylesheet" href="assets/prose.css?v=5">
<script src="assets/i18n.js?v=5" defer></script>
</head>
<body>

<a class="skip-link" href="#main" data-i18n="a11y_skip">Ugrás a tartalomra</a>

<header class="site-header" id="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="OpenSoft">
      <svg viewBox="0 0 200 40" width="150" height="30" aria-hidden="true" focusable="false">
{logo}
      </svg>
    </a>

    <div class="header-actions">
      <div class="lang-switch" id="lang-switch">
        <button class="lang-toggle" id="lang-toggle" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-menu" data-i18n-aria="nav_lang_label">
          <svg class="lang-globe" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M3 12h18"></path>
            <path d="M12 3c2.5 2.7 3.8 5.8 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.8-3.8-9S9.5 5.7 12 3z"></path>
          </svg>
          <span id="lang-current">HU</span>
          <svg class="lang-caret" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
        <ul class="lang-menu" id="lang-menu" role="listbox" hidden></ul>
      </div>
      <a class="btn btn-primary btn-sm" href="index.html"><span class="btn-back" aria-hidden="true">&larr;</span><span data-i18n="nav_back"></span></a>
    </div>
  </div>
</header>

<main id="main" class="page">
  <div class="container">
    <div class="page-inner">
      <a class="back-link" href="index.html"><span aria-hidden="true">&larr;</span> <span data-i18n="nav_back"></span></a>
      <p class="doc-lang-note" hidden><span data-i18n="doc_lang_hu"></span></p>

      <div id="doc" data-doc="{slug}">
{fragment}      </div>

      <p class="page-back">
        <a class="btn btn-outline" href="index.html"><span class="btn-back" aria-hidden="true">&larr;</span><span data-i18n="nav_back"></span></a>
      </p>
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">

      <div class="footer-col footer-brand">
        <svg viewBox="0 0 200 40" width="150" height="30" role="img" aria-label="OpenSoft" focusable="false">
{logo}
        </svg>
        <p class="footer-tagline" data-i18n="footer_tagline"></p>
      </div>

      <div class="footer-col">
        <h2 class="footer-heading" data-i18n="footer_links_title"></h2>
        <ul class="footer-links">
{nav}
        </ul>
      </div>

      <div class="footer-col">
        <h2 class="footer-heading" data-i18n="footer_contact_title"></h2>
        <ul class="footer-links">
          <li><a href="mailto:administrator@opensoft.hu">administrator@opensoft.hu</a></li>
        </ul>
      </div>

    </div>
    <div class="footer-bottom">
      <p id="copyright"></p>
    </div>
  </div>
</footer>

</body>
</html>
'''

made, missing = 0, []
for lang in LANGS:
    (PAGES / lang).mkdir(parents=True, exist_ok=True)
    for slug in DOCS:
        doc = read_doc(lang, slug)
        if doc is None:
            missing.append('%s/%s' % (lang, slug))
            continue
        (PAGES / lang / ('%s.html' % slug)).write_text(fragment(*doc), encoding='utf-8', newline='\n')
        made += 1

for slug in DOCS:
    baked = DEFAULT_LANG if (CONTENT / DEFAULT_LANG / ('%s.md' % slug)).exists() else 'en'
    doc = read_doc(baked, slug)
    if doc is None:
        print('SKIP %s.html - no source' % slug)
        continue
    title, desc, body = doc
    frag = '\n'.join('        ' + l for l in fragment(title, desc, body).split('\n'))
    (ROOT / ('%s.html' % slug)).write_text(
        TPL.format(lang=baked, title=_html.escape(title), desc=_html.escape(desc[:300]),
                   logo=INNER, slug=slug, fragment=frag, nav=footer_links(slug)),
        encoding='utf-8', newline='\n')
    print('%-13s baked=%s' % ('%s.html' % slug, baked))

print('\nfragments: %d / %d written' % (made, len(LANGS) * len(DOCS)))
if missing:
    print('MISSING (%d): %s' % (len(missing), ', '.join(missing)))
print('editor-only blocks stripped: %d' % stripped)

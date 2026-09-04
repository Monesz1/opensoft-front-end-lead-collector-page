/* Shared language layer - loaded by index.html and by every sub-page.
   Exposes window.OS. Sub-pages need nothing else; main.js builds on it. */
window.OS = (function () {
'use strict';

const DEFAULT_LANG = 'hu';

/* Add a language here and drop the matching i18n/<code>.json beside it. */
const LANGUAGES = [
  { code: 'hu', label: 'Magyar' }, { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' }, { code: 'sk', label: 'Slovenčina' },
  { code: 'ro', label: 'Română' }, { code: 'hr', label: 'Hrvatski' },
  { code: 'cs', label: 'Čeština' }, { code: 'pl', label: 'Polski' },
  { code: 'fr', label: 'Français' }, { code: 'it', label: 'Italiano' }
];

const SINKS = [
  ['data-i18n', (el, v) => { el.textContent = v; }],
  ['data-i18n-placeholder', (el, v) => { el.placeholder = v; }],
  ['data-i18n-content', (el, v) => { el.content = v; }],
  ['data-i18n-aria', (el, v) => el.setAttribute('aria-label', v)]
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const mk = (tag, props, at) => {
  const el = Object.assign(document.createElement(tag), props);
  Object.keys(at || {}).forEach(k => el.setAttribute(k, at[k]));
  return el;
};
const store = (k, v) => {
  try { return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v); }
  catch (e) { return null; }
};
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* main.js reads .dict and .lang, and sets .onApply to re-render its own bits. */
const api = { LANGUAGES, lang: DEFAULT_LANG, dict: {}, mk, onApply: null };

/* saved choice, then browser language, then Hungarian */
const pickLang = () => [store('lang'), (navigator.language || '').slice(0, 2).toLowerCase()]
  .find(c => LANGUAGES.some(l => l.code === c)) || DEFAULT_LANG;

/* Same ?v= as this script, so bumping the asset version also busts the language files
   and page fragments. Without it they are fetched unversioned and a cached copy keeps
   serving until max-age expires, leaving newly added keys blank. */
const ASSET_V = (() => {
  const el = document.querySelector('script[src*="i18n.js"]');
  const m = el && el.getAttribute('src').match(/[?&]v=([^&]+)/);
  return m ? `?v=${m[1]}` : '';
})();

const loadDict = code => fetch(`i18n/${code}.json${ASSET_V}`).then(res => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
});

function apply(data) {
  api.dict = data;
  SINKS.forEach(([attr, set]) => $$(`[${attr}]`).forEach(el => {
    const v = data[el.getAttribute(attr)];
    if (v) set(el, v);
  }));
  /* Sub-page titles are a bare page name; index.html's meta_title already carries the brand. */
  const t = $('title[data-brand]');
  if (t && t.textContent) t.textContent += ' | OpenSoft';
  swapDocument();
  document.documentElement.lang = api.lang;
  const cur = $('#lang-current');
  if (cur) cur.textContent = api.lang.toUpperCase();
  const cp = $('#copyright');
  if (cp && data.footer_copyright) {
    cp.textContent = `© ${new Date().getFullYear()} ${data.footer_copyright}`;
  }
  renderMenu();
  if (api.onApply) api.onApply(data);
}

/* Never throws: a missing dict leaves the page as-is. */
function load() {
  const code = pickLang();
  return loadDict(code)
    .then(d => { api.lang = code; apply(d); })
    .catch(() => code === DEFAULT_LANG ? null
      : loadDict(DEFAULT_LANG).then(d => { api.lang = DEFAULT_LANG; apply(d); }))
    .catch(e => console.warn('i18n unavailable, keeping current text:', e.message));
}

/* Document pages carry the default-language body inline (so crawlers and no-JS visitors get real
   content) and swap in pages/<lang>/<doc>.html when another language is chosen. The fragments are
   our own build output, served same-origin - never user input - so innerHTML is safe here. */
let docLoaded = DEFAULT_LANG;

function loadDoc(box, lang, fallback) {
  return fetch(`pages/${lang}/${box.dataset.doc}.html${ASSET_V}`)
    .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.text(); })
    .then(html => {
      if (!fallback && lang !== api.lang) return;   // a later switch already won
      box.innerHTML = html;
      docLoaded = lang;
      const h1 = box.querySelector('.page-title');
      if (h1) {
        document.title = `${h1.textContent} | OpenSoft`;
        const d = $('meta[name="description"]');
        if (d && h1.dataset.desc) d.content = h1.dataset.desc;
      }
      const note = $('.doc-lang-note');
      if (note) note.hidden = !fallback;
    });
}

/* No translation for this language yet: fall back to the default language rather than leaving
   whichever one happened to load last on screen, so the "available in Hungarian" notice is true. */
function swapDocument() {
  const box = $('#doc');
  if (!box) return;
  const note = $('.doc-lang-note');
  if (docLoaded === api.lang) {          // already showing this language - clear any stale notice
    if (note) note.hidden = true;
    return;
  }
  loadDoc(box, api.lang, false)
    .catch(() => loadDoc(box, DEFAULT_LANG, true))
    .catch(e => console.warn('document unavailable:', e.message));
}

function renderMenu() {
  const menu = $('#lang-menu');
  if (!menu) return;
  menu.textContent = '';
  LANGUAGES.forEach(l => {
    const b = mk('button', { type: 'button', textContent: l.label },
      { role: 'option', 'aria-selected': String(l.code === api.lang) });
    b.addEventListener('click', () => {
      store('lang', l.code);
      openMenu(false);
      $('#lang-toggle').focus();
      load();
    });
    const li = mk('li');
    li.append(b);
    menu.append(li);
  });
}

function openMenu(open) {
  $('#lang-menu').hidden = !open;
  $('#lang-toggle').setAttribute('aria-expanded', String(open));
  const first = $('#lang-menu button');
  if (open && first) first.focus();
}

function initDropdown() {
  const menu = $('#lang-menu');
  if (!menu) return;
  renderMenu();
  $('#lang-toggle').addEventListener('click', () => openMenu(menu.hidden));
  document.addEventListener('click', e => {
    if (!menu.hidden && !$('#lang-switch').contains(e.target)) openMenu(false);
  });
  $('#lang-switch').addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { openMenu(false); $('#lang-toggle').focus(); }
    if (menu.hidden || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    e.preventDefault();
    const items = $$('#lang-menu button');
    const i = items.indexOf(document.activeElement) + (e.key === 'ArrowDown' ? 1 : -1);
    items[(i + items.length) % items.length].focus();
  });
}

api.scrollTo = el => el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    a.addEventListener('click', e => {
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.setAttribute('tabindex', '-1');
      api.scrollTo(target);
      target.focus({ preventScroll: true });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDropdown();
  initSmoothScroll();
  load();
});

return api;
}());

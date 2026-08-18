/* OpenSoft Lead Collector - landing-page behaviour. Requires assets/i18n.js (window.OS).
   Vanilla ES6, no dependencies, no build step. */
(function () {
'use strict';

/* The form is POSTed here; the response is a confirmation status, not the demo URL (a confirmation
   email is sent, and the demo opens after the visitor confirms). */
const WEBHOOK_URL = 'https://n8n.opensoft.hu/webhook/demo-request';
/* Polled after submit to learn when the instance is REALLY ready (provisioning ~3 min); keyed by an
   opaque per-request id so no personal data is put in the URL. */
const STATUS_URL = 'https://n8n.opensoft.hu/webhook/demo-status';
const ADMIN_EMAIL = 'administrator@opensoft.hu';   /* shown when provisioning fails or never completes */
const RECAPTCHA_SITE_KEY = '6Lc6YX4tAAAAALDBYk7jw3GpDot2ZAcRexsxGCVT';

/* Opaque random id that ties this submission to its readiness status (crypto.randomUUID on HTTPS,
   getRandomValues fallback otherwise). */
function newRequestId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  if (window.crypto && crypto.getRandomValues) {
    const a = new Uint8Array(16); crypto.getRandomValues(a);
    return [...a].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);   /* last-resort, still unique */
}

/* Set enabled:true to show a product in the picker. Only enabled products appear; the rest show a
   greyed "Coming soon" card. Order matches the cards in index.html. */
const PRODUCTS = [
  { id: 'vtiger', name: 'vTiger CRM', enabled: true },
  { id: 'odoo', name: 'Odoo', enabled: false },
  { id: 'dolibarr', name: 'Dolibarr', enabled: false },
  { id: 'espocrm', name: 'EspoCRM', enabled: false },
  { id: 'suitecrm', name: 'SuiteCRM', enabled: false },
  { id: 'erpnext', name: 'ERPNext', enabled: false },
  { id: 'axelor', name: 'Axelor', enabled: false },
  { id: 'metasfresh', name: 'metasfresh', enabled: false }
].map(p => ({ ...p, icon: `assets/icons/${p.id}.svg` }));

const RE_MOBILE = /^\+?[1-9]\d{7,14}$/;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ['firstName', 'lastName', 'company', 'mobile', 'email'];

const touched = {};
const loadedAt = Date.now();          /* anti-spam: humans do not fill this in under a second */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* product picker */
function renderPickerLabel() {
  const sel = $('#selected-product'), label = $('#picker-selected');
  if (!sel || !label) return;                 /* form card is gone after a successful submit */
  const hit = PRODUCTS.find(p => p.id === sel.value);
  label.textContent = hit ? hit.name : '';
}

function pickerButton(p) {
  const b = OS.mk('button', { type: 'button', className: 'product-pick' },
    { role: 'radio', 'aria-checked': 'false', 'data-product': p.id });
  b.append(OS.mk('img', { src: p.icon, alt: '', width: 40, height: 40 }),
    OS.mk('span', { textContent: p.name }));
  b.addEventListener('click', () => selectProduct(p.id));
  return b;
}

function initProductSelector() {
  $('#product-picker').append(...PRODUCTS.filter(p => p.enabled).map(pickerButton));
}

function selectProduct(id) {
  $('#selected-product').value = id;
  $$('#product-picker .product-pick').forEach(b => {
    const on = b.dataset.product === id;
    b.classList.toggle('selected', on);
    b.setAttribute('aria-checked', String(on));
  });
  showError('product', '');
  renderPickerLabel();
  updateSubmitState();
}

/* Demo/learn CTAs: on an enabled card, scroll to the form and pre-select that product.
   Disabled cards are inert (pointer-events:none in CSS) and show a "Coming soon" badge. */
function goToForm(pid) {
  selectProduct(pid);
  OS.scrollTo($('#lead-form'));
  const empty = FIELDS.map(f => $(`#${f}`)).find(el => !el.value.trim());
  if (empty) setTimeout(() => empty.focus({ preventScroll: true }), 400);
}

function initCards() {
  $$('.product-card').forEach(card => {
    const pid = card.dataset.product;
    const product = PRODUCTS.find(p => p.id === pid);
    const on = !!(product && product.enabled);
    card.querySelectorAll('.demo-cta-btn').forEach(btn => {
      if (on) { btn.addEventListener('click', () => goToForm(pid)); }
      else { btn.setAttribute('aria-disabled', 'true'); btn.setAttribute('tabindex', '-1'); }
    });
  });
  refreshComingSoon();
}

/* Coming-soon badge text is a CSS ::after content:attr(data-soon); keep it translated. */
function refreshComingSoon() {
  const soon = OS.dict.card_cta_soon || 'Coming soon';
  $$('.product-card[data-disabled]').forEach(c => { c.dataset.soon = soon; });
}

/* 06... is normalised, not rejected. */
function normaliseMobile(raw) {
  const v = String(raw || '').replace(/[\s\-.\/()]/g, '');
  if (v.startsWith('00')) return `+${v.slice(2)}`;
  if (v.startsWith('06')) return `+36${v.slice(2)}`;
  return v;
}

function checkField(id) {
  const v = $(`#${id}`).value.trim();
  if (id === 'mobile') return RE_MOBILE.test(normaliseMobile(v)) ? '' : 'err_mobile';
  if (id === 'email') return RE_EMAIL.test(v) ? '' : 'err_email';
  return v.length >= 2 ? '' : 'err_required';
}

function showError(name, key) {
  const p = $(`[data-error-for="${name}"]`);
  p.textContent = key ? (OS.dict[key] || '') : '';
  p.hidden = !key;
}

function validateField(input) {
  const id = input.id, key = checkField(id);
  if (!key && id === 'mobile') input.value = normaliseMobile(input.value.trim());
  if (touched[id]) {
    const wrap = input.closest('.field');
    wrap.classList.toggle('invalid', !!key);
    wrap.classList.toggle('valid', !key);
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
    showError(id, key);
  }
  return !key;
}

function validateForm() {
  FIELDS.forEach(f => { touched[f] = true; });
  const fieldsOk = FIELDS.map(f => validateField($(`#${f}`))).every(Boolean);
  const hasProduct = !!$('#selected-product').value;
  if (!hasProduct) showError('product', 'err_product');
  const terms = $('#terms').checked;
  showError('terms', terms ? '' : 'form_terms_error');
  return fieldsOk && hasProduct && terms;
}

function updateSubmitState() {
  $('#submit-btn').disabled =
    !(FIELDS.every(f => !checkField(f)) && $('#selected-product').value && $('#terms').checked);
}

function initValidation() {
  FIELDS.forEach(id => {
    const el = $(`#${id}`);
    el.addEventListener('blur', () => {
      touched[id] = true; validateField(el); updateSubmitState();
    });
    el.addEventListener('input', () => {
      if (touched[id]) validateField(el);
      updateSubmitState();
    });
  });
}

/* submit */
/* Invisible proof-of-work: find a nonce so SHA-256(challenge+nonce) opens with 12 zero bits.
   No third party, no external script - but it requires a real JS engine + crypto.subtle, so a
   blind curl to the webhook cannot forge it. The server re-verifies the hash, the difficulty and
   the challenge freshness. */
async function proofOfWork(challenge) {
  if (!(window.crypto && crypto.subtle)) return -1;
  const enc = new TextEncoder();
  for (let n = 0; n < 5e6; n++) {
    const h = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(challenge + n)));
    if (h[0] === 0 && h[1] < 16) return n;          /* 12 leading zero bits */
  }
  return -1;
}

async function buildPayload(requestId) {
  const email = $('#email').value.trim();
  const challenge = email + ':' + Date.now();       /* bound to submitter + submit time */
  return {
    source: 'opensoft-lead-collector',
    requestId: requestId,                            /* opaque id the page polls for readiness */
    product: $('#selected-product').value,
    firstName: $('#firstName').value.trim(),
    lastName: $('#lastName').value.trim(),
    company: $('#company').value.trim(),
    mobile: normaliseMobile($('#mobile').value.trim()),
    email: email,
    language: OS.lang,
    submittedAt: new Date().toISOString(),
    pageUrl: location.href,
    /* anti-spam signals, all re-checked server-side */
    website: $('#website').value,            /* honeypot: must arrive empty */
    elapsedMs: Date.now() - loadedAt,        /* must be >= MIN_FILL_MS */
    termsAccepted: $('#terms').checked,      /* T&C consent, re-checked server-side */
    powChallenge: challenge,                 /* proof-of-work challenge string */
    powNonce: await proofOfWork(challenge),  /* -1 if crypto.subtle is unavailable */
    recaptcha_token: await recaptchaToken()  /* reCAPTCHA v3 token, verified server-side */
  };
}

function onSubmitFail(btn, msg) {
  showToast(msg || OS.dict.toast_error, 'error');
  btn.disabled = false;
  btn.textContent = OS.dict.form_submit || '';
  updateSubmitState();
}

function focusFirstInvalid() {
  const t = !$('#selected-product').value ? '#product-picker button'
    : (FIELDS.find(checkField) ? `#${FIELDS.find(checkField)}` : '#terms');
  $(t).focus();
}

async function submitForm(event) {
  event.preventDefault();
  if (!validateForm()) return focusFirstInvalid();
  const product = PRODUCTS.find(p => p.id === $('#selected-product').value);
  if (!product || !product.enabled) {
    return showToast(OS.dict.form_error_no_product || OS.dict.err_product, 'error');
  }
  const btn = $('#submit-btn');
  btn.disabled = true;
  btn.textContent = OS.dict.form_submitting || '...';
  const email = $('#email').value.trim();       /* capture before the form is replaced */
  const requestId = newRequestId();
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(await buildPayload(requestId))
    });
    if (res.status === 429) return onSubmitFail(btn, OS.dict.form_rate_limited);   /* Traefik per-IP limit */
    const d = await res.json().catch(() => ({}));
    if (res.ok && d && (d.status === 'pending_confirmation' || d.status === 'already_requested'))
      return showCheckEmail(d.status, email, requestId);
    onSubmitFail(btn);
  } catch (e) { onSubmitFail(btn); }
}

/* reCAPTCHA v3: fetch a fresh token at submit time; '' if the script did not load (n8n then rejects). */
function recaptchaToken() {
  return new Promise(resolve => {
    if (!(window.grecaptcha && grecaptcha.execute)) return resolve('');
    grecaptcha.ready(() =>
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'demo' }).then(resolve, () => resolve('')));
  });
}

/* Webmail deep-links so the visitor can jump straight to their inbox for the confirmation link. */
const MAIL_PROVIDERS = {
  gmail:   { key: 'demo_open_gmail',   url: 'https://mail.google.com/mail/u/0/#search/opensoft' },
  yahoo:   { key: 'demo_open_yahoo',   url: 'https://mail.yahoo.com/' },
  outlook: { key: 'demo_open_outlook', url: 'https://outlook.live.com/mail/0/' }
};
function providerForEmail(email) {
  const dom = (String(email).split('@')[1] || '').toLowerCase();
  if (/(^|\.)gmail\.com$|(^|\.)googlemail\.com$/.test(dom)) return 'gmail';
  if (/(^|\.)yahoo\./.test(dom)) return 'yahoo';
  if (/(^|\.)(outlook|hotmail|live|msn)\./.test(dom)) return 'outlook';
  return null;
}
/* Known provider -> one precise button; unknown/corporate domain -> Gmail + Yahoo (the most common). */
function mailButtons(email) {
  const hit = providerForEmail(email);
  return (hit ? [hit] : ['gmail', 'yahoo']).map(id => {
    const p = MAIL_PROVIDERS[id];
    return OS.mk('a',
      { className: 'btn btn-outline btn-sm ce-mail-btn', textContent: OS.dict[p.key] || id },
      { href: p.url, target: '_blank', rel: 'noopener noreferrer' });
  });
}

/* The instance provisions in the background (~3 min). The demo URL is deliberately NOT shown before the
   visitor confirms by email — so this polls the backend for the REAL status and only settles into
   "ready" when provisioning has actually finished (no more guessing with a fixed timer). */
const POLL_MS = 4000;
const POLL_MAX = 105;                 /* ~7 min ceiling; provisioning is ~3 min, so this only trips when
                                         something is badly wrong (n8n/Redis down) — treated as "contact us" */
/* On a failed / didn't-complete outcome, offer a direct line to a human. */
function appendContact(card) {
  if (card.querySelector('.ce-contact')) return;
  const a = OS.mk('a', { className: 'ce-contact', textContent: ADMIN_EMAIL },
    { href: 'mailto:' + ADMIN_EMAIL });
  (card.querySelector('.ce-progress') || card).append(a);
}
function runReadyAnimation(card, requestId) {
  const bar = card.querySelector('.ce-bar > span');
  const status = card.querySelector('.ce-status');
  const spinner = card.querySelector('.ce-spinner');
  const setStatus = k => { if (status && OS.dict[k]) status.textContent = OS.dict[k]; };
  const setTitle = k => { const t = card.querySelector('.success-title'); if (t && OS.dict[k]) t.textContent = OS.dict[k]; };
  const setText = k => { const p = card.querySelector('.success-text'); if (p) p.textContent = OS.dict[k] || ''; };
  /* visual reassurance only — the bar eases toward 90% over ~3 min (CSS) but never reaches 100% on a
     timer; the "ready" jump to 100% is driven by the real status below. */
  if (bar) setTimeout(() => { bar.style.width = '90%'; }, 50);
  const t2 = setTimeout(() => setStatus('demo_prep_2'), 40000);
  const t3 = setTimeout(() => setStatus('demo_prep_3'), 100000);

  let done = false, tries = 0;
  const stopTimers = () => { clearTimeout(t2); clearTimeout(t3); };
  const settleReady = () => {                  /* provisioning finished -> the email has just been sent */
    done = true; stopTimers();
    if (bar) { bar.style.transition = 'width .5s ease-out'; bar.style.width = '100%'; }
    if (spinner) spinner.classList.add('done');
    card.classList.add('ce-ready');
    setTitle('demo_ready_title');              /* only now claim it's ready + emailed */
    setText('demo_ready_msg');
    setStatus('demo_prep_ready');
    const mb = card.querySelector('.ce-mail-btns'); if (mb) mb.hidden = false;   /* now there's mail to open */
  };
  const settleOther = (msgKey, titleKey) => {  /* capacity / failed / slow: honest, not "ready" */
    done = true; stopTimers();
    if (spinner) spinner.classList.add('done');
    setTitle(titleKey);
    setText(msgKey);                           /* the detail becomes the main message */
    if (status) status.textContent = '';       /* drop the little "preparing…" step line */
    if (msgKey !== 'demo_prep_slow') card.classList.add('ce-warn');
    if (msgKey === 'demo_prep_failed' || msgKey === 'demo_prep_slow') appendContact(card);
  };
  const poll = () => {
    if (done) return;
    if (++tries > POLL_MAX) return settleOther('demo_prep_slow', 'demo_slow_title');
    fetch(STATUS_URL + '?rid=' + encodeURIComponent(requestId), { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null)).catch(() => null)
      .then(d => {
        if (done) return;
        const s = d && d.status;
        if (s === 'ready') return settleReady();
        if (s === 'capacity') return settleOther('demo_prep_capacity', 'demo_cap_title');
        if (s === 'failed') return settleOther('demo_prep_failed', 'demo_err_title');
        setTimeout(poll, POLL_MS);            /* pending / null / network blip -> keep waiting */
      });
  };
  setTimeout(poll, POLL_MS);
}

/* n8n replies {status:"pending_confirmation"} (new) or {status:"already_requested"} (duplicate within the
   cooldown) and emails a confirmation link. Replace the WHOLE form card (heading, intro, form) with a
   focused "check your email" panel: inbox shortcut(s) + a live "preparing your demo" indicator. */
function showCheckEmail(status, email, requestId) {
  const dup = status === 'already_requested';
  const card = OS.mk('div', { id: 'demo-sent', className: 'success-card check-email' + (dup ? ' ce-dup' : '') },
    { role: 'status', 'aria-live': 'polite', tabindex: '-1' });
  card.append(OS.mk('div', { className: 'ce-spinner' + (dup ? ' done' : '') }, { 'aria-hidden': 'true' }));
  /* New submits start in the "preparing" phase (the email is only sent when provisioning finishes ~3 min
     later); the title/text flip to the "ready" copy in settleReady(). Duplicates keep the sent-copy. */
  card.append(OS.mk('h2', { className: 'success-title',
    textContent: OS.dict[dup ? 'demo_sent_again_title' : 'demo_prep_title'] || 'Preparing your demo…' }));
  card.append(OS.mk('p', { className: 'success-text',
    textContent: OS.dict[dup ? 'demo_sent_again_msg' : 'demo_prep_msg'] || '' }));
  if (email) card.append(OS.mk('p', { className: 'ce-email', textContent: email }));
  const btns = mailButtons(email || '');
  if (btns.length) {
    const w = OS.mk('div', { className: 'ce-mail-btns' });
    w.append(...btns);
    if (!dup) w.hidden = true;                   /* nothing to open yet — revealed once really ready */
    card.append(w);
  }
  if (!dup) {
    const prog = OS.mk('div', { className: 'ce-progress' });
    const bar = OS.mk('div', { className: 'ce-bar' }); bar.append(OS.mk('span', {}));
    prog.append(bar, OS.mk('p', { className: 'ce-status', textContent: OS.dict.demo_prep_1 || '' }));
    card.append(prog);
  }
  /* let the visitor return to the home page / a fresh form */
  const back = OS.mk('button', { type: 'button', className: 'ce-back',
    textContent: OS.dict.demo_back || 'Back to the home page' });
  back.addEventListener('click', () => location.reload());
  card.append(back);
  const host = $('.lead-card') || $('#lead-form-el').parentNode;
  host.textContent = '';                          /* drop heading, intro, required-note and the form */
  host.append(card);
  card.focus({ preventScroll: true });
  if (!dup) runReadyAnimation(card, requestId);
}

function showToast(message, type) {
  if (!message) return;
  const t = OS.mk('div', { className: `toast toast-${type}`, textContent: message });
  $('#toast-root').append(t);
  setTimeout(() => { if (t.parentNode) t.remove(); }, 3000);
}

document.addEventListener('DOMContentLoaded', function init() {
  initProductSelector();
  initCards();
  initValidation();
  $('#lead-form-el').addEventListener('submit', submitForm);
  $('#terms').addEventListener('change', () => { showError('terms', ''); updateSubmitState(); });
  updateSubmitState();
  /* i18n.js calls onApply after every language change */
  OS.onApply = () => { renderPickerLabel(); refreshComingSoon(); };
});
}());

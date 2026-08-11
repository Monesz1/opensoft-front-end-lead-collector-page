/* OpenSoft Lead Collector - landing-page behaviour. Requires assets/i18n.js (window.OS).
   Vanilla ES6, no dependencies, no build step. */
(function () {
'use strict';

/* One n8n webhook handles every product; the workflow routes by the `product` field in the payload.
   The demo URL is NOT returned here - n8n emails a confirmation link, then the demo after confirming. */
const WEBHOOK_URL = 'https://n8n.opensoft.hu/webhook/demo-request';
const RECAPTCHA_SITE_KEY = '6Lc6YX4tAAAAALDBYk7jw3GpDot2ZAcRexsxGCVT';

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
  const hit = PRODUCTS.find(p => p.id === $('#selected-product').value);
  $('#picker-selected').textContent = hit ? hit.name : '';
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

/* 06... is normalised, not rejected - internal test notes TC-WEB-004. */
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
   blind curl to the webhook cannot forge it. n8n re-verifies the hash, the difficulty and the
   challenge freshness before provisioning (see server-side notes). */
async function proofOfWork(challenge) {
  if (!(window.crypto && crypto.subtle)) return -1;
  const enc = new TextEncoder();
  for (let n = 0; n < 5e6; n++) {
    const h = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(challenge + n)));
    if (h[0] === 0 && h[1] < 16) return n;          /* 12 leading zero bits */
  }
  return -1;
}

async function buildPayload() {
  const email = $('#email').value.trim();
  const challenge = email + ':' + Date.now();       /* bound to submitter + submit time */
  return {
    source: 'opensoft-lead-collector',
    product: $('#selected-product').value,
    firstName: $('#firstName').value.trim(),
    lastName: $('#lastName').value.trim(),
    company: $('#company').value.trim(),
    mobile: normaliseMobile($('#mobile').value.trim()),
    email: email,
    language: OS.lang,
    submittedAt: new Date().toISOString(),
    pageUrl: location.href,
    /* anti-spam signals, all re-checked in n8n - see server-side notes */
    website: $('#website').value,            /* honeypot: must arrive empty */
    elapsedMs: Date.now() - loadedAt,        /* must be >= MIN_FILL_MS */
    termsAccepted: $('#terms').checked,      /* T&C consent, re-checked server-side */
    powChallenge: challenge,                 /* proof-of-work challenge string */
    powNonce: await proofOfWork(challenge),  /* -1 if crypto.subtle is unavailable */
    recaptcha_token: await recaptchaToken()  /* reCAPTCHA v3 token, verified in n8n */
  };
}

function onSubmitFail(btn) {
  showToast(OS.dict.toast_error, 'error');
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
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(await buildPayload())
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok && d && d.status === 'pending_confirmation') return showCheckEmail();
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

/* n8n replies {status:"pending_confirmation"} and emails a confirmation link; the demo URL follows by
   email once the visitor confirms. Replace the form with a "check your email" card. */
function showCheckEmail() {
  const card = OS.mk('div', { id: 'demo-sent', className: 'success-card' },
    { role: 'alert', 'aria-live': 'polite', tabindex: '-1' });
  card.append(
    OS.mk('div', { className: 'success-icon', textContent: '✉' }),
    OS.mk('p', { className: 'success-title', textContent: OS.dict.demo_sent_title || 'Check your email' }),
    OS.mk('p', { className: 'success-text', textContent: OS.dict.demo_sent_msg || '' }));
  $('#lead-form-el').replaceWith(card);
  card.focus({ preventScroll: true });
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

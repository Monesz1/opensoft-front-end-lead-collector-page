/* OpenSoft Lead Collector - landing-page behaviour. Requires assets/i18n.js (window.OS).
   Vanilla ES6, no dependencies, no build step. */
(function () {
'use strict';

/* Per-product config. To activate a product: set enabled:true and fill webhookUrl + demoUrl,
   then set data-disabled + demo-button label on its card in index.html. Order matches the cards.
   Only enabled products appear in the form picker; disabled ones show "Coming soon". */
const PRODUCTS = [
  { id: 'vtiger', name: 'vTiger CRM', enabled: true,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-vtiger', demoUrl: 'https://demo.opensoft.hu' },
  { id: 'odoo', name: 'Odoo', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-odoo', demoUrl: '' },
  { id: 'dolibarr', name: 'Dolibarr', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-dolibarr', demoUrl: '' },
  { id: 'espocrm', name: 'EspoCRM', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-espocrm', demoUrl: '' },
  { id: 'suitecrm', name: 'SuiteCRM', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-suitecrm', demoUrl: '' },
  { id: 'erpnext', name: 'ERPNext', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-erpnext', demoUrl: '' },
  { id: 'axelor', name: 'Axelor', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-axelor', demoUrl: '' },
  { id: 'metasfresh', name: 'metasfresh', enabled: false,
    webhookUrl: 'https://n8n.opensoft.hu/webhook/demo-metasfresh', demoUrl: '' }
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
  return fieldsOk && hasProduct;
}

function updateSubmitState() {
  $('#submit-btn').disabled =
    !(FIELDS.every(f => !checkField(f)) && $('#selected-product').value);
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
function buildPayload() {
  return {
    source: 'opensoft-lead-collector',
    product: $('#selected-product').value,
    firstName: $('#firstName').value.trim(),
    lastName: $('#lastName').value.trim(),
    company: $('#company').value.trim(),
    mobile: normaliseMobile($('#mobile').value.trim()),
    email: $('#email').value.trim(),
    language: OS.lang,
    submittedAt: new Date().toISOString(),
    pageUrl: location.href,
    /* anti-spam signals, re-checked in n8n - see server-side notes */
    website: $('#website').value,       /* honeypot: must arrive empty */
    elapsedMs: Date.now() - loadedAt    /* must be >= MIN_FILL_MS */
  };
}

function onSubmitFail(btn) {
  showToast(OS.dict.toast_error, 'error');
  btn.disabled = false;
  btn.textContent = OS.dict.form_submit || '';
  updateSubmitState();
}

function submitForm(event) {
  event.preventDefault();
  if (!validateForm()) {
    return $(!$('#selected-product').value
      ? '#product-picker button' : `#${FIELDS.find(checkField)}`).focus();
  }
  const product = PRODUCTS.find(p => p.id === $('#selected-product').value);
  if (!product || !product.enabled || !product.webhookUrl) {
    return showToast(OS.dict.form_error_no_product || OS.dict.err_product, 'error');
  }
  const btn = $('#submit-btn');
  btn.disabled = true;
  btn.textContent = OS.dict.form_submitting || '...';
  fetch(product.webhookUrl, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload())
  })
    .then(res => res.json().catch(() => ({})).then(d => ({ ok: res.ok, d })))
    .then(({ ok, d }) => (ok && d && d.demo_url)
      ? startDemoCountdown(d.demo_url, Number(d.ready_in_seconds) || 60)
      : onSubmitFail(btn))
    .catch(() => onSubmitFail(btn));
}

/* n8n responds { demo_url, ready_in_seconds }; show a countdown, then redirect.
   No localStorage — the URL lives only in this closure (KERNEL: lost on redirect otherwise). */
function startDemoCountdown(demoUrl, seconds) {
  const card = OS.mk('div', { id: 'demo-countdown', className: 'success-card' },
    { role: 'alert', 'aria-live': 'polite', tabindex: '-1' });
  const num = OS.mk('strong', { id: 'countdown-num', textContent: String(seconds) });
  const line = OS.mk('p', { className: 'countdown-line' });
  line.append(
    document.createTextNode((OS.dict.demo_redirect_in || 'Redirecting in') + ' '),
    num, document.createTextNode(' s'));
  card.append(
    OS.mk('div', { className: 'success-icon', textContent: '✓' }),
    OS.mk('p', { className: 'success-title', textContent: OS.dict.demo_provisioning_msg || 'Preparing your system…' }),
    line);
  $('#lead-form-el').replaceWith(card);
  card.focus({ preventScroll: true });
  let r = seconds;
  const timer = setInterval(() => {
    r -= 1;
    const el = $('#countdown-num');
    if (el) el.textContent = String(Math.max(0, r));
    if (r <= 0) { clearInterval(timer); window.location.href = demoUrl; }
  }, 1000);
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
  updateSubmitState();
  /* i18n.js calls onApply after every language change */
  OS.onApply = () => { renderPickerLabel(); refreshComingSoon(); };
});
}());

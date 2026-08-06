/* OpenSoft Lead Collector - landing-page behaviour. Requires assets/i18n.js (window.OS).
   Vanilla ES6, no dependencies, no build step. */
(function () {
'use strict';

/* Change N8N_WEBHOOK_URL per deployment. */
const N8N_WEBHOOK_URL = 'https://n8n.opensoft.hu/webhook/lead-collector';

/* Order matches the cards in index.html; icon is derived from id. */
const PRODUCTS = [
  { id: 'vtiger', name: 'vTiger CRM' }, { id: 'odoo', name: 'Odoo' },
  { id: 'dolibarr', name: 'Dolibarr' }, { id: 'espocrm', name: 'EspoCRM' },
  { id: 'suitecrm', name: 'SuiteCRM' }, { id: 'erpnext', name: 'ERPNext' },
  { id: 'axelor', name: 'Axelor' }, { id: 'metasfresh', name: 'metasfresh' }
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
  $('#product-picker').append(...PRODUCTS.map(pickerButton));
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

function initLearnButtons() {
  $$('.js-learn').forEach(b => b.addEventListener('click', () => {
    selectProduct(b.dataset.product);
    OS.scrollTo($('#lead-form'));
    const empty = FIELDS.map(f => $(`#${f}`)).find(el => !el.value.trim());
    if (empty) setTimeout(() => empty.focus({ preventScroll: true }), 400);
  }));
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

function submitForm(event) {
  event.preventDefault();
  if (!validateForm()) {
    return $(!$('#selected-product').value
      ? '#product-picker button' : `#${FIELDS.find(checkField)}`).focus();
  }
  const btn = $('#submit-btn');
  btn.disabled = true;
  btn.textContent = OS.dict.form_submitting || '...';
  fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload())
  })
    .then(res => { if (res.ok) showSuccess(); else showToast(OS.dict.toast_error, 'error'); })
    .catch(() => showToast(OS.dict.toast_error, 'error'))
    .then(() => { btn.textContent = OS.dict.form_submit || ''; updateSubmitState(); });
}

function showSuccess() {
  $('#lead-form-el').hidden = true;
  const card = $('#success-card');
  card.hidden = false;
  card.setAttribute('tabindex', '-1');
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
  initLearnButtons();
  initValidation();
  $('#lead-form-el').addEventListener('submit', submitForm);
  updateSubmitState();
  OS.onApply = renderPickerLabel;   /* i18n.js calls this after every language change */
});
}());

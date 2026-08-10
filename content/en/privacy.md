---
page: adatkezeles
title: Data Handling
slug: /adatkezeles
lang: en
meta_title: Data handling — explained in plain terms | OpenSoft
meta_description: What we do with your data, where we store it, how long we keep it, and what you can ask of us at any time. Plain human language instead of legalese.
last_updated: "{{LAST_UPDATED}}"
review_status: TERVEZET — publikálás előtt adatvédelmi jogi ellenőrzés szükséges
---

# Data Handling

**Effective:** {{EFFECTIVE_DATE}} · **Version:** {{POLICY_VERSION}} · **Last updated:** {{LAST_UPDATED}}

---

## Why this page exists

Our [GDPR notice](gdpr.html) is the official document, written in formal legal language. It is mandatory, precise, and — honestly — nobody enjoys reading that kind of thing.

This page covers the same ground, just in plain human language. If you find any contradiction between the two, please let us know at {{PRIVACY_EMAIL}} — in legal matters the text of the GDPR notice prevails, but the contradiction is still our fault, and we will fix it.

---

## The short answer

If you read only one paragraph, let it be this one:

> **We ask only for what we genuinely need in order to be able to respond to you. What you provide, we store on our own servers; we do not sell it, we do not build a profile of you, and beyond the cases required by law we do not pass it on to anyone. You can ask us at any time what data we hold about you, and you can request its deletion at any time. A single email is enough for that — you do not even need to give a reason.**

Everything else is just detail — but the detail matters too, which is why we spell it out.

---

## What data we handle

We do not collect data "just in case". Personal data reaches us in the situations below — the complete, legal list is set out in section 4 of the [GDPR notice](gdpr.html).

**1. If you request a demo from us.** In that case you provide your first and last name, your company name, your mobile number and your email address, and the system also records which product you selected, in which language you viewed the site, when you submitted the form, and which page you submitted it from.

We ask for this because otherwise we cannot arrange a demo. We need your name and company name so we know who we are talking to; your email address and phone number so we can reach you; and the selected system so that it is not a generic sales rep who calls you back, but the colleague who knows that particular system.

**2. If you write to us via the contact form.** In that case we handle your email address and the text of your message. Nothing else.

**3. If you become our customer.** In that case we handle the data required for the contract and for invoicing, along with the contact details of the colleagues who serve as contact persons.

In addition, our own application and webhook servers log incoming requests: the IP address, the time, and which page the browser requested. This is needed for secure operation — for example, in order to detect an attack. The server logs of the website itself are handled by our hosting provider — we name it in section 6 of the [GDPR notice](gdpr.html).

**What we do not handle:** we do not use any traffic-analytics tool, we do not use any advertising system, we do not track you across other sites, and we do not buy databases from anywhere. If your email address has reached us, there can be two reasons: either you sent it to us, or it was provided by the company where you are a contact person — in the latter case we inform you separately, in accordance with Article 14 GDPR.

---

## Where we store the data

This is the point where we differ from most providers, so it is worth reading.

It is important to distinguish between **the website** and **your data** — the two are not served by the same machine, and it would be dishonest to conflate them.

**Enquiries and customer data are stored on our own servers, within the European Union — we operate these machines ourselves.** The data in regular use — the enquiries received and the customer records — sit on the machine that we maintain and to which we grant access. They are not floating around "somewhere in the cloud", and they are not scattered across a dozen external services.

**The website itself, however, is served as static files by GitHub (GitHub Pages)**, a United States company. Out of technical necessity it sees visitors' IP addresses, and it handles its own server logs — solely for operational and security purposes — as an independent controller; we have no access to them. The safeguards for the data transfer (standard contractual clauses, and the EU–US Data Privacy Framework) are detailed in sections 6 and 7 of the [GDPR notice](gdpr.html). We do not gloss over this, because a "nothing at our end goes to a third party" type of statement simply would not be true.

**What you enter in the form, however, does not pass through GitHub.** GitHub serves the page you are currently reading; the form submits directly to our EU server. Your personal data therefore does not touch GitHub's systems.

The fact that enquiries and customer data reside on our own servers has three consequences, and all three work in your favour:

- **We can tell you where your data is.** Not in theory, but specifically.
- **Our sub-processors may not use it for their own purposes.** They may act solely on our written instructions: they may not sell it, may not analyse it, and may not train anything with it. Their full list is set out in section 6 of the [GDPR notice](gdpr.html).
- **If you request deletion, we really can delete it.** We do not have to hunt through a dozen external systems.

The backups likewise remain under our control, encrypted, and equally within the EU.

---

## Who we pass it to

**We do not sell your data, do not trade it, do not lend it for marketing purposes, and do not share it with "partners".** There is no third party that could access your data for its own business purposes — for example for marketing or profiling.

There are nonetheless two cases in which data may leave our hands, and we have to mention both honestly — because a neat "never, to no one" claim simply would not be true:

**1. If the law requires it.** If a court, a public prosecutor's office, an investigating authority or the NAV turns to us with a lawful request, we are obliged to provide data. In such cases we disclose only what the request specifically concerns.

**2. Sub-processors required for operation.** These are not "third parties" in the sense of being able to use the data for their own business purposes: they handle the data we pass to them solely on our instructions, under a written data-processing agreement. Their full list appears in [section 6 of the GDPR notice](gdpr.html), with names and storage locations.

This includes GitHub, which serves the website — with the distinction already noted above, namely that it handles its own server logs, for operational and security purposes, as an independent controller and not on our instructions. This is the case with every hosting and CDN provider; we spell it out because without it the sentence above would be inaccurate.

> ### ⚠ Note to the editor — to be decided before publication
>
> The statement above — that no third party accesses the data for its own business purposes — **remains true only** if the site loads no further external service. The current state:
>
> - **GitHub Pages (hosting)** → ✅ **resolved:** named, with its dual role (processor for the serving, independent controller for its own logs) and the safeguard for the US data transfer described.
> - **CAPTCHA** → ✅ **resolved:** there is none. Spam protection is server-side (honeypot field, fill-in time, origin check), without any external service. The `Policy check` step in `deploy.yml` fails on any external resource, so this is also protected by an automated check.
> - **External email-sending service** (e.g. MailerSend, SendGrid) → ⚠️ **open:** if there is one, it is a processor and must be named in section 6 of gdpr.md.
> - **CDN or proxying DNS** (e.g. Cloudflare) → ⚠️ **open:** if the proxy is enabled, it sees the visitor's IP address and must be named.
> - **Font or script from an external domain** → ✅ there is none; the `Policy check` would fail on this too.
>
> Close out the two open items before publication.
>
> **A data-handling notice that states something other than what the site actually does is worse than having no notice at all.**

---

## How long we keep it

We do not keep it forever, but in some cases the law prescribes a longer retention period than you would ask for.

| What | How long | Why |
|---|---|---|
| Demo request, if no contract results from it | {{LEAD_RETENTION_PERIOD}} from the last contact | This is roughly how long it takes for an enquiry to turn into a decision |
| Demo request, if you indicate that you are not interested | we delete it within 30 days | We have no reason to keep it |
| Contact-form message | {{ENQUIRY_RETENTION_PERIOD}} after the correspondence is closed | So that it can be looked up what we agreed |
| Contract data | 5 years from the end of the contract | The general limitation period under the Civil Code |
| Invoices and accounting documents | **8 years** | Section 169 of Act C of 2000 on Accounting makes it mandatory |
| Newsletter subscription *(only if such a service exists — see the note below)* | Until consent is withdrawn | You decide on it, not us |
| Server logs | {{LOG_RETENTION_PERIOD}} | Operation and security |

The 8-year accounting retention is the most common case in which **we cannot fully comply with your deletion request** — the destruction of an issued invoice is prohibited by law. Similarly, we keep the contract data until the end of the 5-year limitation period, and the few-line suppression entry we describe below also remains. In such cases we tell you exactly what it is that we have to keep, and why; everything else we delete.

---

## How we delete

If you request deletion, we do not just tick a "deleted" checkbox in the database.

1. We remove the record from the live system immediately.
2. From the backups, the record disappears during the backups' ordinary overwrite cycle; this is at most {{BACKUP_ROTATION_PERIOD}}. During this time we use the backup solely for restoration, not for lookups.
3. We keep a single small trace: the fact that you requested deletion. This is usually an email address and a date. It is needed solely so that we do not accidentally contact you again. If you would like this deleted too, we will do that as well — just be aware that afterwards you could end up in a new database again.
4. We send a confirmation once the deletion is complete.

---

## What you can ask of us at any time

These are not favours, but your rights. You do not have to give a reason, and they are free of charge — unless a request is manifestly unfounded or excessive, for example repetitive; in that case, under Article 12(5) GDPR, we may charge a reasonable fee, but we always give reasons for it.

- **"What data of mine do you hold?"** — We provide the full list, in readable form.
- **"This data is incorrect, please correct it."** — We correct it.
- **"Delete my data."** — We delete it, with the three exceptions described above: the accounting documents (legal obligation), the contract data until the end of the limitation period (the establishment of legal claims) and the suppression entry.
- **"Give me my data so I can take it elsewhere."** — We provide it in a structured, commonly used, machine-readable format.
- **"Stop processing it until we sort this out."** — We restrict the processing.
- **"I object to the way my data is being handled."** — If the processing is based on a legitimate interest (for example in the case of contact-form messages or server logs), you may object at any time, and we weigh it on the merits. In the case of marketing there is no weighing: we stop immediately and without exception.
- **"I withdraw my consent."** — You can do so just as easily as you gave it.

**How:** write to {{PRIVACY_EMAIL}}. A single sentence is enough.

**How long it takes:** we respond within **one month** at the latest. If the request is particularly complex, this may be extended by two months, but we will notify you of this within the first month, and we will also state the reason.

We may ask whether you really are the person writing — but only if it is genuinely in doubt, and we do not use any data received for verifying identity for any other purpose.

---

## What you manage yourself — and what we decided

- **We send a newsletter only on separate request.** The demo-request form does not contain any marketing consent: whoever fills it in receives a quote, not a newsletter. If you would nonetheless like a newsletter later, you can request it separately, with a checkbox that is not pre-ticked.
- **If we have a newsletter, you can unsubscribe from it with a single click**, at the bottom of every message. You do not have to log in, you do not have to give a reason, and we do not send an "are you sure?" question.
- **The language choice is stored by your browser**, not by us. Clearing the browser's storage removes this too.
- **On the demo-request form every field is mandatory** — we decided this, and we have marked it accordingly. There is not one of them for which we lack a reason we could not explain: the email address and the mobile number are for reaching you, the name and company name are for identification, and selecting the system is so that the right colleague calls you back.

> **Note to the editor.** The website currently has **no newsletter subscription**, and no marketing checkbox either. If you do not even plan one, delete the newsletter-related rows from this section and from the retention table, as well as section 4.4 of gdpr.md. Documenting processing that does not happen is just as much of a mistake as promising a checkbox that does not exist.

---

## Transparency

A few principles we consider binding on ourselves:

- **We do not ask for more than what is needed.** If we cannot justify a field, then we take it off the form.
- **We do not hide consent inside text.** Consent is always a separate, not pre-ticked checkbox.
- **We do not use misleading buttons.** Unsubscribe will not be pale grey, and "no thanks" will not be hidden.
- **If a personal data breach occurs**, and it is likely to result in a high risk to your rights, we notify you directly. Even when it is unpleasant — and this is, in any case, also a legal obligation of ours. We notify the authority of every reportable breach within 72 hours.
- **If this notice changes**, the new version number and date appear at the top. We give advance notice of any material change.

---

## Cookies

**This website does not use cookies for traffic analysis, advertising or tracking.**

There is a single thing we store in your browser: the two-letter code of the selected language (for example `hu`). Technically this is not even a cookie, but an entry placed in browser storage (`localStorage`); it does not reach the server, and its sole purpose is that next time you do not have to choose a language again.

That is why no cookie banner greets you. Not because we forgot about it, but because there is nothing for you to consent to.

**And that is also why there is no CAPTCHA.** Our forms are protected against bots not by an external service, but by server-side checks in our own system: a honeypot field that must arrive empty, a minimum fill-in time, and a check of the submitting page. A CAPTCHA widget would have placed a cookie, would have required prior consent, and would have sent your device data to another company — and, on top of that, it would not even have protected the endpoint that matters. This decision is justified in detail in section 7 of `server-side notes`.

---

## Contact and remedies

For any question relating to data handling:

**{{COMPANY_LEGAL_NAME}}**
{{COMPANY_ADDRESS}}
Email: **{{PRIVACY_EMAIL}}** · Phone: {{CONTACT_PHONE}}

Please contact us first — most questions are resolved this way the fastest. Independently of that, you may turn to the supervisory authority or to a court at any time:

**National Authority for Data Protection and Freedom of Information (NAIH)**
1055 Budapest, Falk Miksa utca 9–11. · Postal address: 1363 Budapest, Pf. 9.
Phone: +36 1 391 1400 · Email: ugyfelszolgalat@naih.hu · Web: naih.hu

You may also initiate court proceedings. The matter falls within the competence of the regional court (törvényszék), and you may also choose to bring the action before the regional court of the place of your domicile or residence.

---

## Editable placeholders

| Placeholder | What it is for |
|---|---|
| `{{COMPANY_LEGAL_NAME}}` · `{{COMPANY_ADDRESS}}` · `{{PRIVACY_EMAIL}}` · `{{CONTACT_PHONE}}` | Identification and contact details of the controller |
| `{{EFFECTIVE_DATE}}` · `{{POLICY_VERSION}}` · `{{LAST_UPDATED}}` | Version tracking |
| `{{LEAD_RETENTION_PERIOD}}` · `{{ENQUIRY_RETENTION_PERIOD}}` · `{{LOG_RETENTION_PERIOD}}` · `{{BACKUP_ROTATION_PERIOD}}` | Specific retention periods — "as long as necessary" is not acceptable |

The question of the hosting provider (GitHub Pages) and of spam protection is **decided**, so there is no longer a placeholder for these. If the website later moves to our own EU server, the GitHub paragraph of the "Where we store" section can be deleted.

---

> ## Before you publish
>
> **This is a professionally structured draft text, not legal advice.** Before going live, have it reviewed by a lawyer experienced in Hungarian data protection law. There are three things only you can decide:
>
> 1. **Make sure a true statement is put in place of every placeholder.** Especially the retention periods: a specific duration or a specific condition is required, not generalities.
> 2. **Check the statement about third parties all the way through** against the list above — the hosting provider is already named, the other items (reCAPTCHA, email sender, CDN) are still open questions. This is the strongest and at the same time the riskiest section of the document.
> 3. **Compare the NAIH contact details with the naih.hu site** — the authority has moved before.
